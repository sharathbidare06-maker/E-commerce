package com.ecommerce.product.service;
import com.azure.storage.blob.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class AzureBlobStorageService {
  private final BlobContainerClient container;
  public AzureBlobStorageService(
      @Value("${AZURE_STORAGE_CONNECTION_STRING:}") String connection,
      @Value("${AZURE_STORAGE_CONTAINER:product-images}") String containerName) {
    this.container = connection == null || connection.isBlank() ? null :
      new BlobServiceClientBuilder().connectionString(connection).buildClient().getBlobContainerClient(containerName);
  }
  public String upload(String fileName, byte[] data) {
    if (container == null) throw new IllegalStateException("Azure Blob Storage is not configured");
    BlobClient blob = container.getBlobClient(fileName);
    blob.upload(new java.io.ByteArrayInputStream(data), data.length, true);
    return blob.getBlobUrl();
  }
}
