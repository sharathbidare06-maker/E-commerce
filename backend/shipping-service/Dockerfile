FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY shipping-service/pom.xml shipping-service/pom.xml
COPY shipping-service/src shipping-service/src
RUN mvn -f shipping-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/shipping-service/target/shipping-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
