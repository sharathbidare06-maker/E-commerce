# Three-Tier E-Commerce Architecture

Presentation tier:
React frontend.

Application/API tier:
Spring Cloud Gateway and five Spring Boot microservices:
Home, Product, Cart, Order and Payment.

Data tier:
Separate PostgreSQL database per microservice. Product images are stored in Azure Blob Storage.

Request flow:
React -> API Gateway -> Microservice -> PostgreSQL/Azure Blob Storage

Production recommendations:
- JWT/OAuth2 authentication
- HTTPS/TLS
- Kafka or RabbitMQ for asynchronous order/payment events
- Redis for cart/cache
- centralized logging and tracing
- Prometheus/Grafana
- Kubernetes/EKS/AKS
- Terraform
- CI/CD with Jenkins or GitHub Actions
