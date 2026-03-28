# EduMy

An e-learning platform built with ASP.NET Core and React. Students can browse and enroll in courses, watch video lectures, complete quizzes, and leave reviews. Lecturers can create and manage their own courses. Admins manage users and categories.

## Tech Stack

**Backend**
- ASP.NET Core 10 — REST API with JWT authentication
- Entity Framework Core 10 + PostgreSQL
- Clean Architecture (Domain → Application → Infrastructure → API)
- BCrypt password hashing
- AI-powered diploma verification (Llama 3.2 Vision via Ollama)

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Axios
- Video.js (with YouTube support)
- Font Awesome icons

## Features

- **Guest** — Browse courses, view details and ratings
- **Student** — Enroll in courses, watch lectures, take quizzes, leave reviews, track progress
- **Lecturer** — Create and publish courses with modules, lectures (video), and quizzes; see enrollment stats
- **Admin** — Manage users (block/unblock), manage categories

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Ollama](https://ollama.com/) with `llama3.2-vision` model (for diploma verification)

### Backend

```bash
# 1. Configure the connection string in:
#    src/External/EduMy.Api/appsettings.json

# 2. Run the API (migrations and seeding run automatically)
cd src/External/EduMy.Api
dotnet run
```

The API starts on `http://localhost:5084` by default.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Demo Accounts

| Role     | Email                   | Password     |
|----------|-------------------------|--------------|
| Admin    | admin@edumy.com         | Admin123!    |
| Lecturer | lecturer@edumy.com      | Lecturer123! |
| Student  | student@edumy.com       | Student123!  |

## Project Structure

```
EduMy/
├── src/
│   ├── Core/
│   │   ├── EduMy.Domain/          # Entities, enums
│   │   └── EduMy.Application/     # Services, DTOs, repository interfaces
│   └── External/
│       ├── EduMy.Api/             # Controllers, middleware, Program.cs
│       └── EduMy.Infrastructure/  # EF Core, repositories, data seeder
├── client/                        # React frontend
│   └── src/
│       ├── pages/                 # Route-level components
│       ├── AuthContext.jsx        # Auth state
│       ├── App.jsx                # Router setup
│       └── api.js                 # Axios instance
└── EduMy.postman_collection.json  # Postman collection for all endpoints
```
