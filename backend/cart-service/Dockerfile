FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY cart-service/pom.xml cart-service/pom.xml
COPY cart-service/src cart-service/src
RUN mvn -f cart-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/cart-service/target/cart-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
