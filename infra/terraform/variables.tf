variable "subscription_id" {
  type        = string
  description = "Azure subscription ID. Prefer ARM_* environment variables in CI."
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "environment" {
  type    = string
  default = "qa"
}

variable "name_prefix" {
  type    = string
  default = "ecommerce"
}

variable "aks_node_count" {
  type    = number
  default = 2
}

variable "aks_vm_size" {
  type    = string
  default = "Standard_D2s_v5"
}

variable "postgres_admin_username" {
  type      = string
  sensitive = true
}

variable "postgres_admin_password" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}
