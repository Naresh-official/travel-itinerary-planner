// Mock API service using dummy data
// In a real application, these would be actual HTTP requests using axios

const mockTrips = [
  {
    id: 1,
    name: "Summer Europe Adventure",
    description: "A 2-week journey through the best of Europe",
    startDate: "2024-07-01",
    endDate: "2024-07-14",
    destinations: [
      {
        id: 1,
        name: "Paris, France",
        location: "Paris, France",
        description: "The City of Light",
        arrivalDate: "2024-07-01",
        departureDate: "2024-07-05",
        activities: [
          {
            id: 1,
            name: "Visit Eiffel Tower",
            description: "Iconic tower visit with sunset views",
            location: "Champ de Mars, Paris",
            date: "2024-07-02",
            time: "18:00",
            duration: "2 hours",
            cost: 25,
          },
          {
            id: 2,
            name: "Louvre Museum",
            description: "World's largest art museum",
            location: "Rue de Rivoli, Paris",
            date: "2024-07-03",
            time: "10:00",
            duration: "4 hours",
            cost: 17,
          },
        ],
        accommodations: [
          {
            id: 1,
            name: "Hotel Le Marais",
            description: "Boutique hotel in historic district",
            location: "Le Marais, Paris",
            type: "hotel",
            checkIn: "2024-07-01",
            checkOut: "2024-07-05",
            cost: 120,
          },
        ],
        transport: [
          {
            id: 1,
            name: "Flight to Paris",
            description: "Direct flight from JFK",
            type: "flight",
            from: "New York JFK",
            to: "Paris CDG",
            date: "2024-07-01",
            time: "08:00",
            duration: "7h 30m",
            cost: 650,
          },
        ],
      },
      {
        id: 2,
        name: "Rome, Italy",
        location: "Rome, Italy",
        description: "The Eternal City",
        arrivalDate: "2024-07-05",
        departureDate: "2024-07-09",
        activities: [
          {
            id: 3,
            name: "Colosseum Tour",
            description: "Ancient amphitheater guided tour",
            location: "Piazza del Colosseo, Rome",
            date: "2024-07-06",
            time: "09:00",
            duration: "3 hours",
            cost: 35,
          },
        ],
        accommodations: [
          {
            id: 2,
            name: "Roma Central Hotel",
            description: "Modern hotel near Termini Station",
            location: "Via Nazionale, Rome",
            type: "hotel",
            checkIn: "2024-07-05",
            checkOut: "2024-07-09",
            cost: 95,
          },
        ],
        transport: [
          {
            id: 2,
            name: "Train to Rome",
            description: "High-speed train from Paris",
            type: "train",
            from: "Paris Gare de Lyon",
            to: "Roma Termini",
            date: "2024-07-05",
            time: "14:30",
            duration: "11h 15m",
            cost: 89,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Japan Discovery",
    description: "Exploring traditional and modern Japan",
    startDate: "2024-09-15",
    endDate: "2024-09-28",
    destinations: [
      {
        id: 3,
        name: "Tokyo, Japan",
        location: "Tokyo, Japan",
        description: "Bustling metropolis",
        arrivalDate: "2024-09-15",
        departureDate: "2024-09-22",
        activities: [],
        accommodations: [],
        transport: [],
      },
    ],
  },
]

let nextId = 4

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const getTrips = async () => {
  await delay(500)
  return mockTrips
}

export const getTripById = async (id) => {
  await delay(300)
  const trip = mockTrips.find((t) => t.id === Number.parseInt(id))
  if (!trip) {
    throw new Error("Trip not found")
  }
  return trip
}

export const createTrip = async (tripData) => {
  await delay(400)
  const newTrip = {
    id: nextId++,
    ...tripData,
    destinations: [],
  }
  mockTrips.push(newTrip)
  return newTrip
}

export const addDestination = async (tripId, destinationData) => {
  await delay(300)
  const trip = mockTrips.find((t) => t.id === Number.parseInt(tripId))
  if (!trip) {
    throw new Error("Trip not found")
  }

  const newDestination = {
    id: nextId++,
    ...destinationData,
    activities: [],
    accommodations: [],
    transport: [],
  }

  if (!trip.destinations) {
    trip.destinations = []
  }
  trip.destinations.push(newDestination)

  return newDestination
}

export const addActivity = async (destinationId, activityData) => {
  await delay(300)

  // Find the destination across all trips
  let destination = null
  for (const trip of mockTrips) {
    if (trip.destinations) {
      destination = trip.destinations.find((d) => d.id === Number.parseInt(destinationId))
      if (destination) break
    }
  }

  if (!destination) {
    throw new Error("Destination not found")
  }

  const newActivity = {
    id: nextId++,
    ...activityData,
  }

  if (!destination.activities) {
    destination.activities = []
  }
  destination.activities.push(newActivity)

  return newActivity
}

export const addAccommodation = async (destinationId, accommodationData) => {
  await delay(300)

  // Find the destination across all trips
  let destination = null
  for (const trip of mockTrips) {
    if (trip.destinations) {
      destination = trip.destinations.find((d) => d.id === Number.parseInt(destinationId))
      if (destination) break
    }
  }

  if (!destination) {
    throw new Error("Destination not found")
  }

  const newAccommodation = {
    id: nextId++,
    ...accommodationData,
  }

  if (!destination.accommodations) {
    destination.accommodations = []
  }
  destination.accommodations.push(newAccommodation)

  return newAccommodation
}

export const addTransport = async (destinationId, transportData) => {
  await delay(300)

  // Find the destination across all trips
  let destination = null
  for (const trip of mockTrips) {
    if (trip.destinations) {
      destination = trip.destinations.find((d) => d.id === Number.parseInt(destinationId))
      if (destination) break
    }
  }

  if (!destination) {
    throw new Error("Destination not found")
  }

  const newTransport = {
    id: nextId++,
    ...transportData,
  }

  if (!destination.transport) {
    destination.transport = []
  }
  destination.transport.push(newTransport)

  return newTransport
}
