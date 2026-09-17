FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY review-service/pom.xml review-service/pom.xml
COPY review-service/src review-service/src
RUN mvn -f review-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/review-service/target/review-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
