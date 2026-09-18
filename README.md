# E-Commerce Microservices Platform

Full-stack starter project:
- React + Vite frontend
- Spring Boot microservices
- Spring Cloud Gateway
- PostgreSQL per service
- Azure Blob Storage for product images
- JUnit 5 + Mockito unit tests
- Docker Compose
- Mermaid architecture
- Git repository ready

## Services
1. API Gateway - 8080
2. Home Service - 8081
3. Product Service - 8082
4. Cart Service - 8083
5. Order Service - 8084
6. Payment Service - 8085
7. Shipping Service - 8086
8. Auth Service - 8087
9. Review Service - 8088

## Run locally
```bash
docker compose up --build
```

Docker Compose reuses each service image when its Dockerfile inputs are unchanged. After changing one service, rebuild only that service with `docker compose up --build <service-name>`; for example, `docker compose up --build product-service`. Changes to `backend/pom.xml` invalidate all backend services because it is shared by every module.

On Windows, the helper script performs the targeted build and starts the service:

```powershell
.\scripts\build-service.ps1 product-service
```

Copy `.env.example` to `.env` and replace the placeholder secrets before using authenticated features. Never commit `.env`.

Frontend: http://localhost:5173
Gateway: http://localhost:8080

## Azure Blob
Set AZURE_STORAGE_CONNECTION_STRING and AZURE_STORAGE_CONTAINER before starting product-service.

## Runtime data and notifications

## Authentication and roles

Authentication is provided by the `auth-service` and its own `auth_db` database. Customers can register and sign in; administrators use a separate sign-in mode and are provisioned through `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables rather than public registration.
Customers and administrators can register and sign in through the frontend. Admin signup requires the private `ADMIN_SIGNUP_CODE`; the code is never sent to the browser as configuration and should be shared only with trusted operators. The optional `ADMIN_EMAIL` and `ADMIN_PASSWORD` variables still provision a default admin account on startup.

```text
POST /api/auth/register  -> creates CUSTOMER
POST /api/auth/login     -> returns JWT and role
```

Customer and admin accounts are stored in `auth_db` with BCrypt password hashes and their respective roles. Admin accounts created with the invite code are persisted in the same database.

## Product reviews

Reviews are stored independently in `review_db` and are associated with a product ID and the authenticated customer's email:

```text
GET  /api/reviews/product/{productId} -> public reviews for a product
POST /api/reviews                     -> authenticated CUSTOMER review
DELETE /api/reviews/{id}              -> authenticated ADMIN moderation
```

Review writes are authorized by the gateway. The review service validates product IDs, ratings from 1 to 5, and review text up to 1,000 characters.

The API gateway validates the JWT and allows product writes only for `ADMIN` tokens. Product reads remain public. Backend service ports are internal to the Docker network; only the gateway and frontend are exposed, so callers cannot bypass gateway authorization.

Use a long random `JWT_SECRET` in every environment. Never commit `ADMIN_PASSWORD` or JWT secrets.

This is a service-owned data model. Each service stores its own data in a separate PostgreSQL database; services do not share tables directly.

| Service | Database | Stores |
| --- | --- | --- |
| Product | `product_db` | Products, prices, stock, image URLs |
| Cart | `cart_db` | Guest cart items and product snapshots |
| Order | `order_db` | Orders, customer email, delivery address, notifications |
| Payment | `payment_db` | Payment amount, status, and provider reference |
| Shipping | `shipping_db` | Delivery address, shipment status, and tracking number |

Checkout now collects the customer email and delivery address. The order, payment, and shipment records are persisted and creation is idempotent by order ID, so retrying a request does not create duplicate payment or shipment records.

When an order is created, the order service stores an `ORDER_CREATED` notification with `PENDING` status. The notification endpoint is:

```text
GET /api/orders/{orderId}/notifications
```

This is the durable notification/outbox foundation. Actual email or SMS delivery should be connected through a worker or message broker, using the notification status for retries. Credentials for an email provider belong in Azure Key Vault or Azure DevOps secret variables, never in source control.

PostgreSQL data is persisted through named Docker volumes. Removing containers does not remove the data; use `docker compose down -v` only when intentionally resetting local databases.

## Why the folders exist

- `backend/` contains the independently deployable Spring Boot services and their application code.
- `db/` contains database initialization assets, such as product seed data.
- `infra/postgres/` documents the local and production database ownership model.
- `scripts/` contains local development helpers, such as targeted service builds.
- `ecommerce-k8s` contains the reusable Helm chart and environment-specific AKS manifests.
- `ecommerce-terraform` contains Azure infrastructure code and operational documentation.
- `azure-pipelines.yml` builds the application, pushes images to ACR, and promotes the same image tag through AKS environments.

Infrastructure and deployment configuration live in separate repositories so Azure resources and AKS settings can evolve without mixing them into service code.

## Azure DevOps CI/CD

The pipeline is defined in `azure-pipelines.yml` and uses Azure Container Registry (ACR) and Azure Kubernetes Service (AKS).

Pipeline flow:

```text
Build and test -> Build and push images to ACR -> QA AKS -> UAT AKS -> Production AKS
```

The pipeline builds and tests the Maven backend and Vite frontend, then builds these images in ACR:

- `ecommerce/api-gateway`
- `ecommerce/home-service`
- `ecommerce/product-service`
- `ecommerce/cart-service`
- `ecommerce/order-service`
- `ecommerce/payment-service`
- `ecommerce/shipping-service`
- `ecommerce/frontend`

Images are tagged with the Azure DevOps build ID. The same tag is promoted through QA, UAT, and production.

### Required pipeline variables

Configure these as Azure DevOps pipeline variables or, preferably, in a linked variable group. `azureServiceConnection` must exactly match an enabled Azure Resource Manager service connection authorized for this pipeline:

```yaml
azureServiceConnection: 'your-azure-service-connection'
acrName: 'your-acr-name'
aksResourceGroup: 'your-resource-group'
aksClusterName: 'your-aks-cluster'
```

Do not store passwords, tokens, database credentials, or the Azure Blob connection string in the YAML file. Use Azure DevOps Variable Groups or Azure Key Vault.

The pipeline also checks out the `ecommerce-k8s` Azure Repos repository. Update the `resources.repositories[].name` value in `azure-pipelines.yml` if that repository is in a different Azure DevOps project, and authorize the pipeline to read it.

### AKS manifests

The Kubernetes repository contains the reusable Helm chart and reserves these folders for environment-specific raw manifests:

```text
ecommerce-k8s/k8s/
	qa/
	uat/
	prod/
```

Each environment folder should contain the required Deployments, Services, ConfigMaps, and Secrets. Secrets should be created securely in AKS or loaded from Key Vault; do not commit secret values.

### Helm deployment

The reusable Helm chart creates Deployments and ClusterIP Services for the gateway, backend services, and frontend. Use one environment values file per release and provide secrets through an existing Kubernetes Secret:

```bash
helm upgrade --install ecommerce ../ecommerce-k8s/helm/ecommerce \
	--namespace ecommerce-qa \
	--create-namespace \
	--values ../ecommerce-k8s/helm/ecommerce/environments/qa.yaml \
	--set imageTag=your-image-tag
```

### Environment approvals and permissions

Create these Azure DevOps environments with the exact names:

- `ecommerce-qa`
- `ecommerce-uat`
- `ecommerce-prod`

Configure approvals and checks on `ecommerce-uat` and `ecommerce-prod`. Restrict production deployment permissions to the release team and allow the pipeline service connection to use each environment.

The Azure service connection needs access to the AKS resource group and permission to build and push images to ACR. The AKS node identity needs `AcrPull` permission on the registry. Production deployment runs only from the `main` branch.
