FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY order-service/pom.xml order-service/pom.xml
COPY order-service/src order-service/src
RUN mvn -f order-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/order-service/target/order-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
