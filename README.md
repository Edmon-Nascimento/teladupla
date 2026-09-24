# Tela Dupla

Tela Dupla is a fullstack web application for discovering and managing movies and TV series using data from the TMDB API.

Users can explore trending content, search for movies and TV series, view detailed information, save titles to their favorites, and manage reviews after authentication.

## Technologies

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Docker

### External APIs

* TMDB API

## Features

* Trending movies
* Trending TV series
* Movie and TV series search
* Movie and TV series details
* User authentication
* Favorites
* Reviews
* Watch history
* Responsive interface
* Desktop and mobile navigation

## Architecture

The project is organized into separate frontend and backend applications:

```text
Tela Dupla
├── Frontend
│   ├── Next.js
│   ├── React
│   ├── TypeScript
│   └── Tailwind CSS
│
└── Backend
    ├── Express
    ├── Prisma
    └── PostgreSQL
```

The frontend communicates with the application's backend API, while the backend handles authentication, data persistence, database operations, and integration with TMDB.

## Prerequisites

Make sure you have the following installed:

* Node.js
* Bun
* Docker
* Docker Compose

## Installation

Clone the repository:

```bash
git clone https://github.com/Edmon-Nascimento/teladupla.git
cd teladupla
```

Install the dependencies:

```bash
bun install
```

Configure the required environment variables according to the project's environment configuration.

Start the PostgreSQL database:

```bash
docker compose up -d
```

Run the database migrations:

```bash
bunx prisma migrate dev
```

## Development

Start the backend:

```bash
bun run server
```

In another terminal, start the frontend:

```bash
bun run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Database

The project uses PostgreSQL running through Docker.

Prisma is responsible for:

* Database schema management
* Migrations
* Database queries
* Relationships between entities

Check the migration status with:

```bash
bunx prisma migrate status
```

## Project Structure

```text
src/
├── app/
│   ├── (main)/
│   │   ├── favorites/
│   │   ├── movie/
│   │   └── search/
│   ├── login/
│   └── register/
│
├── components/
│   ├── common/
│   ├── movies/
│   └── ui/
│
├── contexts/
├── lib/
└── types/

server/
├── src/
│   ├── db.ts
│   ├── routes/
│   └── types.ts
└── index.ts
```

## Movie Identifiers

The application distinguishes between the database identifier and the public TMDB identifier.

* `id`: internal database identifier used for relationships between entities.
* `tmdbId`: public TMDB identifier used for TMDB integration, routes, and favorites.

This separation prevents conflicts between internal application data and external TMDB identifiers.

## Responsive Design

The interface is designed for desktop and mobile devices.

The Header provides desktop navigation and a responsive side menu for smaller screens.

## Validation

Run the frontend TypeScript check:

```bash
bunx tsc --noEmit
```

Run the backend TypeScript check:

```bash
bunx tsc --noEmit -p server/tsconfig.json
```

Create a production build:

```bash
bun run build
```

## Project Status

Tela Dupla is currently in development.

The next stage is deploying the application and configuring the production environment, including:

* Frontend deployment
* Backend deployment
* Production PostgreSQL database
* Environment variables
* Production API configuration

## License

This project was developed for learning, portfolio, and fullstack web development demonstration purposes.
