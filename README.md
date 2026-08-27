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

## Run locally
```bash
docker compose up --build
```

Frontend: http://localhost:5173
Gateway: http://localhost:8080

## Azure Blob
Set AZURE_STORAGE_CONNECTION_STRING and AZURE_STORAGE_CONTAINER before starting product-service.
