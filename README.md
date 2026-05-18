# 🎬 AI-Based Movie Recommendation

A full-stack AI-powered movie recommendation web application. Users can register, log in, and receive personalized movie recommendations through an intelligent backend that integrates with an external movie/AI API.

---

## 🏗️ Architecture

```
┌─────────────────────┐        ┌──────────────────────────┐
│   React + Vite      │ ──────▶│  Spring Boot REST API     │
│   (Frontend)        │◀────── │  (Backend - Port 8080)    │
└─────────────────────┘        └──────────┬───────────────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                       ┌──────▼──────┐        ┌────────▼────────┐
                       │  MongoDB    │        │  External AI /  │
                       │  Atlas      │        │  Movie API      │
                       └─────────────┘        └─────────────────┘
```

The entire application is packaged into a **single Docker image** via a multi-stage build — the React frontend is built and served as static files from within the Spring Boot app.

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Core language |
| Spring Boot 3.5.5 | REST API framework |
| Spring Security + JWT (JJWT 0.11.5) | Authentication & authorization |
| Spring Data MongoDB | Database access |
| Spring WebFlux (WebClient) | Reactive HTTP calls to external APIs |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool |
| JavaScript | Core language |
| HTML/CSS | Markup & styling |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker (multi-stage) | Containerization |
| MongoDB Atlas | Cloud database |
| Node 22 | Frontend build image |

---

## ✨ Features

- 🔐 JWT-based user registration and login
- 🎥 AI-powered movie recommendations
- 🔍 Browse and search movies
- 🌐 External movie/AI API integration via Spring WebFlux
- 📦 Single-container deployment — frontend served from backend
- 🍃 MongoDB for persisting user data and preferences

---

## 📁 Project Structure

```
Ai_Based_Movie_Recommendation/
├── frontend/
│   └── movie-app/               # React + Vite frontend
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── pages/           # Page views
│       │   └── services/        # API call helpers
│       ├── public/
│       └── package.json
├── src/
│   └── main/java/com/example/movieapi/
│       ├── controller/          # REST controllers
│       ├── service/             # Business logic + AI/movie API calls
│       ├── model/               # MongoDB document models
│       ├── repository/          # Spring Data repositories
│       └── security/            # JWT filter, config
├── Dockerfile                   # Multi-stage build
├── pom.xml
└── mvnw
```

---

## ⚙️ Prerequisites

- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/) and npm
- [Maven 3.8+](https://maven.apache.org/) (or use `./mvnw`)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- API key for the AI/Movie API used by the backend

---

## 🛠️ Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/abRaq45/Ai_Based_Movie_Recommendation.git
cd Ai_Based_Movie_Recommendation
```

### 2. Configure the backend

Edit `src/main/resources/application.properties`:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# JWT
jwt.secret=your_jwt_secret_key

# External Movie/AI API
movie.api.key=your_api_key
movie.api.base-url=https://api.themoviedb.org/3
```

### 3. Run the backend

```bash
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`.

### 4. Run the frontend

```bash
cd frontend/movie-app
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`.

---

## 🐳 Docker Deployment

The multi-stage `Dockerfile` builds both the React frontend and Spring Boot backend into a single runnable image.

### Build the image

```bash
docker build -t movie-recommendation-app .
```

### Run the container

```bash
docker run -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="your_jwt_secret" \
  -e MOVIE_API_KEY="your_api_key" \
  movie-recommendation-app
```

The app will be available at `http://localhost:8080`.

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT token |

### Movies

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies/recommendations` | Get AI-based recommendations |
| `GET` | `/api/movies/search?query=` | Search for movies |
| `GET` | `/api/movies/{id}` | Get movie details |

> **Note:** All `/api/movies` endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🔒 Security

- Passwords are stored securely (BCrypt hashed)
- JWT tokens are used for stateless authentication
- Spring Security filters protect all API routes except `/api/auth/**`

---

## 🧪 Running Tests

```bash
./mvnw test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
