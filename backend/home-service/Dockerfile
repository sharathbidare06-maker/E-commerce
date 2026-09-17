FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml ./pom.xml
COPY home-service/pom.xml home-service/pom.xml
COPY home-service/src home-service/src
RUN mvn -f home-service/pom.xml package spring-boot:repackage -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /workspace/home-service/target/home-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
