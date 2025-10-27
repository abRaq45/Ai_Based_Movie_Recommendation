# ---- Stage 1: Build React frontend ----
FROM node:22 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Build Spring Boot backend ----
FROM maven:3.9.11-eclipse-temurin-14 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Stage 3: Combine & Run ----
FROM eclipse-temurin:14-jdk
WORKDIR /app

# Copy backend JAR
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend build into Spring Boot static folder
COPY --from=frontend-build /frontend/build /app/static/

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
