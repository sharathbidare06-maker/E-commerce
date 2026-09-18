# Repository structure

This repository is a deployable monorepo. Runtime services stay independently buildable, while shared operational files live at the root.

```text
E-commerce2/
├── backend/                       # Spring Boot services and gateway
│   ├── api-gateway/               # Public HTTP entry point, CORS, JWT authorization
│   ├── auth-service/              # Accounts, roles, password hashing, JWT issuing
│   ├── cart-service/              # Cart persistence and cart APIs
│   ├── home-service/              # Home page content APIs
│   ├── order-service/             # Orders and notifications
│   ├── payment-service/           # Payment records and provider boundary
│   ├── product-service/           # Catalog, inventory, images, product stream
│   ├── review-service/            # Product reviews and moderation
│   └── shipping-service/          # Shipment and tracking records
├── frontend/                      # React + Vite web application
│   ├── src/
│   │   ├── config/                # Environment-aware client configuration
│   │   ├── data/                  # Safe offline/demo data and static catalog data
│   │   ├── components/            # Shared UI components as the app is split further
│   │   ├── features/              # Feature-owned UI and state
│   │   ├── pages/                 # Route-level views
│   │   ├── services/              # API clients and browser integrations
│   │   ├── styles/                # Shared design tokens and component styles
│   │   ├── main.jsx               # Browser bootstrap and current app composition
│   │   └── App.test.jsx           # Frontend test entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── db/                            # Database bootstrap and seed data
│   └── product/init.sql
├── docs/                          # Architecture, API, and operational documentation
├── scripts/                       # Local build and developer automation
├── docker-compose.yml              # Local multi-service runtime
├── azure-pipelines.yml            # CI/CD build and promotion pipeline
├── .env.example                   # Non-secret environment variable template
└── README.md                      # Project entry point and setup guide
```

Deployment configuration is maintained in separate repositories:

```text
ecommerce-k8s/                     # Helm chart and Kubernetes manifests
ecommerce-terraform/               # Azure Terraform and infrastructure docs
```

## Backend service layout

Each Spring service owns its database and follows the same internal structure:

```text
<service>/
├── Dockerfile
├── pom.xml
└── src/
    ├── main/java/<package>/
    │   ├── controller/             # HTTP endpoints
    │   ├── service/                # Business workflows
    │   ├── repository/             # Persistence interfaces
    │   ├── entity/                 # Database models
    │   ├── dto/                    # API request/response contracts
    │   └── config/                 # Service configuration and security
    ├── main/resources/             # application.yml and migrations/config
    └── test/java/<package>/        # Unit and slice tests
```

## Frontend boundaries

New frontend work should follow feature ownership:

- Put reusable presentational pieces in `src/components/`.
- Put catalog, authentication, cart, checkout, and admin workflows in `src/features/<feature>/`.
- Put server calls in `src/services/`; components should not duplicate fetch details.
- Put route-level composition in `src/pages/`.
- Keep `src/main.jsx` limited to application bootstrap and top-level composition.
