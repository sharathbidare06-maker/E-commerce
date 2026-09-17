output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "acr_name" {
  value = azurerm_container_registry.this.name
}

output "acr_login_server" {
  value = azurerm_container_registry.this.login_server
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.this.name
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.this.fqdn
}

output "storage_account_name" {
  value = azurerm_storage_account.product_images.name
}
