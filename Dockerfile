# ---- Stage 1: Build React frontend ----
FROM node:22 AS frontend-build
WORKDIR /frontend
COPY frontend/movie-app ./
RUN npm install
RUN npm run build

# ---- Stage 2: Build Spring Boot backend ----
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Stage 3: Combine & Run ----
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy backend JAR
COPY --from=backend-build /app/target/*.jar app.jar

# Copy frontend build output into Spring Boot static folder
COPY --from=frontend-build /frontend/dist /app/static/

# Set entrypoint to run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
