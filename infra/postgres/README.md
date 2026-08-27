# PostgreSQL

Each microservice owns its own database:
home_db, product_db, cart_db, order_db, payment_db.
Use migrations such as Flyway or Liquibase for production instead of ddl-auto=update.
