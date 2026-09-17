FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY product-service/pom.xml product-service/pom.xml
COPY product-service/src product-service/src
RUN mvn -f product-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/product-service/target/product-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
