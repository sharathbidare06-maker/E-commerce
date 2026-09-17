FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY api-gateway/src api-gateway/src
RUN mvn -f api-gateway/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/api-gateway/target/api-gateway-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
