# Travel Itinerary Planner - Backend API

A comprehensive Express.js backend API for managing travel itineraries with MongoDB integration.

## Features

- **Trip Management**: Create and manage travel trips
- **Destination Tracking**: Add destinations to trips with arrival/departure dates
- **Activity Planning**: Schedule activities for each destination
- **Transport Coordination**: Track transportation between destinations
- **Accommodation Management**: Manage hotel bookings and stays

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` with your MongoDB connection string

3. **Start the Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

4. **API Health Check**
   ```
   GET http://localhost:3000/api/health
   ```

## API Endpoints

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip details with all destinations
- `POST /api/trips/:id/destinations` - Add destination to trip

### Destinations
- `POST /api/destinations/:id/activities` - Add activity to destination
- `POST /api/destinations/:id/transport` - Add transport to destination
- `POST /api/destinations/:id/accommodations` - Add accommodation to destination

## Sample API Requests & Responses

### Create a Trip
```bash
POST /api/trips
Content-Type: application/json

{
  "name": "European Adventure 2024",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "_id": "64f8b12345678901234567ab",
    "name": "European Adventure 2024",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "destinations": [],
    "duration": 14,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Add Destination to Trip
```bash
POST /api/trips/64f8b12345678901234567ab/destinations
Content-Type: application/json

{
  "location": "Paris, France",
  "arrivalDate": "2024-06-01T14:00:00.000Z",
  "departureDate": "2024-06-05T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Destination added successfully",
  "data": {
    "_id": "64f8b23456789012345678bc",
    "tripId": "64f8b12345678901234567ab",
    "location": "Paris, France",
    "arrivalDate": "2024-06-01T14:00:00.000Z",
    "departureDate": "2024-06-05T10:00:00.000Z",
    "activities": [],
    "transport": [],
    "accommodations": [],
    "stayDuration": 4,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Add Activity to Destination
```bash
POST /api/destinations/64f8b23456789012345678bc/activities
Content-Type: application/json

{
  "title": "Visit Eiffel Tower",
  "time": "2024-06-02T15:00:00.000Z",
  "notes": "Book tickets in advance. Best views at sunset."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activity added successfully",
  "data": {
    "_id": "64f8b34567890123456789cd",
    "destinationId": "64f8b23456789012345678bc",
    "title": "Visit Eiffel Tower",
    "time": "2024-06-02T15:00:00.000Z",
    "notes": "Book tickets in advance. Best views at sunset.",
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### Add Transport to Destination
```bash
POST /api/destinations/64f8b23456789012345678bc/transport
Content-Type: application/json

{
  "type": "flight",
  "details": "Air France AF1234 - JFK to CDG",
  "time": "2024-06-01T08:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transport added successfully",
  "data": {
    "_id": "64f8b45678901234567890de",
    "destinationId": "64f8b23456789012345678bc",
    "type": "flight",
    "details": "Air France AF1234 - JFK to CDG",
    "time": "2024-06-01T08:00:00.000Z",
    "createdAt": "2024-01-15T10:45:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

### Add Accommodation to Destination
```bash
POST /api/destinations/64f8b23456789012345678bc/accommodations
Content-Type: application/json

{
  "placeName": "Hotel Le Bristol Paris",
  "checkIn": "2024-06-01T15:00:00.000Z",
  "checkOut": "2024-06-05T11:00:00.000Z",
  "notes": "Luxury suite with Eiffel Tower view. Spa appointment booked for June 3rd."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Accommodation added successfully",
  "data": {
    "_id": "64f8b56789012345678901ef",
    "destinationId": "64f8b23456789012345678bc",
    "placeName": "Hotel Le Bristol Paris",
    "checkIn": "2024-06-01T15:00:00.000Z",
    "checkOut": "2024-06-05T11:00:00.000Z",
    "notes": "Luxury suite with Eiffel Tower view. Spa appointment booked for June 3rd.",
    "nights": 4,
    "createdAt": "2024-01-15T10:50:00.000Z",
    "updatedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

### Get All Trips
```bash
GET /api/trips
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f8b12345678901234567ab",
      "name": "European Adventure 2024",
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-06-15T00:00:00.000Z",
      "destinations": [
        {
          "_id": "64f8b23456789012345678bc",
          "location": "Paris, France",
          "arrivalDate": "2024-06-01T14:00:00.000Z",
          "departureDate": "2024-06-05T10:00:00.000Z"
        }
      ],
      "duration": 14,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

### Get Trip Details
```bash
GET /api/trips/64f8b12345678901234567ab
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8b12345678901234567ab",
    "name": "European Adventure 2024",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "destinations": [
      {
        "_id": "64f8b23456789012345678bc",
        "location": "Paris, France",
        "arrivalDate": "2024-06-01T14:00:00.000Z",
        "departureDate": "2024-06-05T10:00:00.000Z",
        "activities": [
          {
            "_id": "64f8b34567890123456789cd",
            "title": "Visit Eiffel Tower",
            "time": "2024-06-02T15:00:00.000Z",
            "notes": "Book tickets in advance. Best views at sunset."
          }
        ],
        "transport": [
          {
            "_id": "64f8b45678901234567890de",
            "type": "flight",
            "details": "Air France AF1234 - JFK to CDG",
            "time": "2024-06-01T08:00:00.000Z"
          }
        ],
        "accommodations": [
          {
            "_id": "64f8b56789012345678901ef",
            "placeName": "Hotel Le Bristol Paris",
            "checkIn": "2024-06-01T15:00:00.000Z",
            "checkOut": "2024-06-05T11:00:00.000Z",
            "notes": "Luxury suite with Eiffel Tower view.",
            "nights": 4
          }
        ],
        "stayDuration": 4
      }
    ],
    "duration": 14
  }
}
```

## Project Structure

```
├── app.js                 # Main application entry point
├── controllers/           # Business logic
│   ├── tripController.js
│   └── destinationController.js
├── models/               # MongoDB schemas
│   ├── Trip.js
│   ├── Destination.js
│   ├── Activity.js
│   ├── Transport.js
│   └── Accommodation.js
├── routes/              # Route definitions
│   ├── tripRoutes.js
│   └── destinationRoutes.js
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## Data Validation

- All required fields are validated
- Date ranges are validated (end dates must be after start dates)
- Destination dates must fall within trip dates
- Activity times must fall within destination stay periods
- Transport types are restricted to valid options
- String lengths are limited to prevent abuse

## Error Handling

- Comprehensive try-catch blocks in all controllers
- Consistent error response format
- Validation error messages
- 404 handling for non-existent resources
- Global error handler middleware