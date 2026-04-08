# KOLHER - Peer-to-Peer Skill Sharing Platform

A full-stack web application for peer-to-peer skill sharing with session booking, ratings, and dashboard management.

## Tech Stack

- **Backend**: Java 17+, Spring Boot 3.2.4, Spring Data JPA, H2 Database
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Build Tool**: Maven

## Project Structure

```
kolher/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/kolher/
│       │   ├── KolherApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── model/{User,Skill,Session,Feedback}.java
│       │   ├── repository/{User,Skill,Session,Feedback}Repository.java
│       │   └── controller/{User,Skill,Session,Feedback}Controller.java
│       └── resources/application.properties
└── frontend/
    ├── index.html
    ├── catalog.html
    ├── booking.html
    ├── dashboard.html
    ├── style.css
    └── app.js
```

## How to Run

### 1. Start the Backend Server

Using Maven Wrapper (no Maven installation needed):
```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
# or
./mvnw spring-boot:run        # Linux/Mac
```

Or if you have Maven installed:
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

- H2 Console: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:mem:kolherdb`

### 2. Serve the Frontend

Using the provided batch script (Windows):
```bash
frontend\start-server.bat
```

Or using Node.js:
```bash
npx http-server frontend -p 5500 -c-1
```

Or simply open `frontend/index.html` directly in your web browser.

### 3. Access the Application

Visit `http://localhost:5500/index.html` (or the file path if opened directly)

## User Flow

1. **Register** a TUTOR account (e.g., username: `alice`, password: `123`, skills: `Math,Python`)
2. **Register** a STUDENT account
3. **Login** as the STUDENT
4. **Search** the skill catalog for available tutors
5. **Book** a session with a tutor
6. **Tutor** accepts/rejects the session from their dashboard
7. **Mark** session as complete
8. **Student** rates the tutor (1-5 stars)
9. **Rating** is automatically calculated and updated

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/{id}` - Get user by ID

### Skills
- `GET /api/skills/search?q={query}` - Search skills by name

### Sessions
- `POST /api/sessions/book` - Book a new session
- `PUT /api/sessions/{id}/status` - Update session status
- `GET /api/sessions/user/{uid}` - Get all sessions for a user

### Feedback
- `POST /api/feedback/submit` - Submit rating/feedback for a session

## Session Statuses

- `PENDING` - Waiting for tutor approval
- `ACCEPTED` - Tutor accepted the session
- `COMPLETED` - Session finished
- `REJECTED` - Tutor rejected the session