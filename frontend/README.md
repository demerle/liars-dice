# Liar's Dice Web Application

A real-time multiplayer implementation of the classic bluffing game Liar's Dice, built with React and Spring Boot.

## Features

- **Real-time multiplayer gameplay** with WebSocket support
- **Room-based system** similar to animemusicquiz.com
- **Password-protected rooms** for private games
- **2-6 players per game**
- **JWT-based authentication**
- **Responsive design** that works on desktop and mobile
- **Docker containerization** for easy deployment

## Tech Stack

### Frontend
- React 18 (JavaScript only, no TypeScript)
- Vite for build tooling
- Vanilla CSS (no UI frameworks)
- Axios for API communication
- React Router for navigation
- WebSocket for real-time updates

### Backend
- Spring Boot 3.2.1
- Spring Security with JWT authentication
- Spring Data JPA with PostgreSQL
- WebSocket support for real-time features
- Maven for dependency management
- Flyway for database migrations

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database
- Nginx for frontend serving and reverse proxy

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liars-dice
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432

### Development Setup

#### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
liars-dice/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS stylesheets
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration and migrations
│   └── pom.xml
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## Game Rules

Liar's Dice is a classic bluffing game where players try to guess the total number of dice showing a particular face value across all players' hidden dice.

### How to Play

1. **Setup**: Each player starts with 5 dice
2. **Roll**: All players roll their dice secretly
3. **Bid**: Players take turns bidding on how many dice of a certain value they think are on the table
4. **Challenge**: Instead of bidding higher, a player can challenge the previous bid
5. **Resolution**: If challenged, all dice are revealed:
   - If the bid was accurate or low, the challenger loses a die
   - If the bid was too high, the bidder loses a die
6. **Elimination**: Players are eliminated when they lose all their dice
7. **Victory**: The last player with dice wins!

### Bidding Rules
- Each bid must be higher than the previous bid
- "Higher" means either more dice of the same value, or the same number of dice of a higher value
- Ones (⚀) are wild and count as any value

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Rooms
- `GET /api/rooms` - Get all available rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/{id}` - Get room details
- `POST /api/rooms/{id}/join` - Join a room
- `DELETE /api/rooms/{id}/leave` - Leave a room

### Games
- `GET /api/games/{id}` - Get game state
- `POST /api/games/{id}/start` - Start game
- `POST /api/games/{id}/move` - Make a game move
- `GET /api/games/{id}/history` - Get game history

### WebSocket
- `/ws/game/{gameId}` - Game real-time updates
- `/ws/room/{roomId}` - Room real-time updates

## Environment Variables

### Backend (.env or application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/liarsdice
    username: liarsdice_user
    password: liarsdice_password
  security:
    jwt:
      secret: your-jwt-secret-key
      expiration: 86400000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic Liar's Dice game
- Room system inspired by animemusicquiz.com
- Built with modern web technologies for optimal performance