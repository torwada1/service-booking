# Service Booking App

A small service-booking demo built to practice Docker and multi-container application workflows. It uses Node.js and Express for a REST API, MongoDB for booking storage, and Docker Compose to run the app and database together.

## Features

- Create and list service bookings through the web form and REST API.
- Update booking status: `pending`, `confirmed`, `completed`, or `cancelled`.
- English and Arabic interface with light and dark themes.
- Docker Compose services for the app and MongoDB.
- A named volume for MongoDB data persistence.
- Health endpoints/checks for the application and database.

## Run with Docker Compose

Requirements: Docker Engine and the Docker Compose plugin.

```sh
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000). To inspect the running services:

```sh
docker compose ps
docker compose logs -f app
```

Stop the containers while retaining MongoDB data:

```sh
docker compose down
```

The `mongo_data` named volume keeps database files when containers stop or are recreated. To also delete that data, use `docker compose down -v`.

## Run locally

Install Node.js 20 or newer and have MongoDB available locally.

```sh
npm install
npm start
```

The defaults are `PORT=3000` and `MONGO_URI=mongodb://127.0.0.1:27017/service_booking`. Set environment variables to override them.

## API

### Health

```http
GET /health
```

### Create a booking

```http
POST /bookings
Content-Type: application/json
```

```json
{
  "customerName": "Sample Customer",
  "phone": "01000000000",
  "carType": "Sedan",
  "serviceType": "Exterior wash",
  "preferredDate": "2026-11-10",
  "preferredTime": "10:00"
}
```

### List bookings

```http
GET /bookings
```

### Update booking status

```http
PATCH /bookings/:id/status
Content-Type: application/json
```

```json
{
  "status": "confirmed"
}
```

Valid statuses are `pending`, `confirmed`, `completed`, and `cancelled`.

## Project structure

```text
.
├── compose.yaml
├── Dockerfile
├── models/
│   └── Booking.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
└── server.js
```

## Demo security note

This project is for learning and portfolio demonstration. The booking list and status endpoint do not require authentication, so do not expose it publicly with real customer data. Environment files, dependencies, and database backups are excluded from Git.

