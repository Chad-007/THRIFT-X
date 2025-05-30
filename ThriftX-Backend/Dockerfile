from maven:3.8.5-openjdk-17 AS build
COPY . .
run mvn clean package -DskipTests


FROM openjdk:17-jdk-slim
COPY --from=build /target/signup-backend-0.0.1-SNAPSHOT.jar ThriftX-Backend.jar
EXPOSE 8080
ENTRYPOINT [ "java","-jar","ThriftX-Backend.jar" ]
