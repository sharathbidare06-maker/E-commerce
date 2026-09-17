# Azure deployment

This project targets AKS, Azure Container Registry, Azure Database for PostgreSQL Flexible Server, Blob Storage, and Azure DevOps Pipelines.

## Provision infrastructure

Use the Terraform foundation in `infra/terraform`:

```powershell
cd infra/terraform
Copy-Item terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars locally. Never commit it.
terraform init
terraform fmt -check
terraform validate
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

For shared environments, configure an Azure Storage backend for Terraform state and use one state file per environment. Do not store state in Git.

Terraform provisions the resource group, ACR, AKS, Log Analytics, product image storage, and PostgreSQL databases. The sample PostgreSQL firewall rule allows Azure services; replace it with private networking before production.

## Configure Azure DevOps

Create an Azure Resource Manager service connection using workload identity federation. Authorize it for this pipeline and configure these pipeline variables or a linked variable group:

```text
azureServiceConnection  # exact Azure DevOps service connection name
acrName                 # Terraform ACR name
aksResourceGroup        # Terraform resource group output
aksClusterName          # Terraform AKS name output
postgresHostQa          # QA Terraform postgres_fqdn output
postgresHostUat         # UAT Terraform postgres_fqdn output
postgresHostProd        # production Terraform postgres_fqdn output
```

The service connection needs permission to build in ACR and read credentials from AKS. Create the `ecommerce-qa`, `ecommerce-uat`, and `ecommerce-prod` Azure DevOps environments; require approvals for UAT and production.

## Deploy

The pipeline builds and tests the application, builds images in ACR, and deploys the matching image tag with Helm:

```bash
helm upgrade --install ecommerce ./helm/ecommerce \
	--namespace ecommerce-qa \
	--create-namespace \
	--values ./helm/ecommerce/environments/qa.yaml \
	--set imageRegistry=YOUR_ACR.azurecr.io \
	--set imageTag=BUILD_ID \
	--set existingSecret=ecommerce-qa-secrets
```

Create the referenced Kubernetes Secret in each namespace through Azure Key Vault or a secure release step. It should contain JWT, database, admin, and Blob Storage settings. Never commit secret values or `terraform.tfvars`.
