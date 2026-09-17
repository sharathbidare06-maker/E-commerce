# E-commerce Helm chart

This chart deploys the gateway, backend services, and frontend. PostgreSQL is expected to be provided by the environment and is configured through the service values.

Use one environment values file per release:

```bash
helm upgrade --install ecommerce ./helm/ecommerce \
  --namespace ecommerce-qa \
  --create-namespace \
  --values ./helm/ecommerce/environments/qa.yaml \
  --set imageTag=BUILD_ID
```

Create the referenced Kubernetes Secret before installing. Do not commit secret values.
