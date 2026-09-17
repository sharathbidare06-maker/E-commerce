# PostgreSQL

Each microservice owns its own database:
home_db, product_db, cart_db, order_db, payment_db, shipping_db.
Use migrations such as Flyway or Liquibase for production instead of ddl-auto=update.

For local Docker Compose, each database uses a named volume so data survives container recreation. The application services connect to their database through `DB_HOST` and `DB_PORT`; they do not connect directly to another service's database.
