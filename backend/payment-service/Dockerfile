FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY payment-service/pom.xml payment-service/pom.xml
COPY payment-service/src payment-service/src
RUN mvn -f payment-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/payment-service/target/payment-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
