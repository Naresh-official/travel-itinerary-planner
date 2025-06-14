import api from './axios';

// Trip API functions
export const getTrips = async () => {
  try {
    const response = await api.get('/trips');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trips');
  }
};

export const getTripById = async (id) => {
  try {
    const response = await api.get(`/trips/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trip');
  }
};

export const createTrip = async (tripData) => {
  try {
    const response = await api.post('/trips', {
      name: tripData.name,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw new Error(error.response?.data?.message || 'Failed to create trip');
  }
};

export const addDestination = async (tripId, destinationData) => {
  try {
    const response = await api.post(`/trips/${tripId}/destinations`, {
      location: destinationData.name,
      arrivalDate: destinationData.arrivalDate,
      departureDate: destinationData.departureDate,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding destination:', error);
    throw new Error(error.response?.data?.message || 'Failed to add destination');
  }
};

// Destination API functions
export const addActivity = async (destinationId, activityData) => {
  try {
    const response = await api.post(`/destinations/${destinationId}/activities`, {
      title: activityData.name,
      time: new Date(`${activityData.date}T${activityData.time}`).toISOString(),
      notes: activityData.description || '',
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw new Error(error.response?.data?.message || 'Failed to add activity');
  }
};

export const addAccommodation = async (destinationId, accommodationData) => {
  try {
    const response = await api.post(`/destinations/${destinationId}/accommodations`, {
      placeName: accommodationData.name,
      checkIn: new Date(accommodationData.checkIn).toISOString(),
      checkOut: new Date(accommodationData.checkOut).toISOString(),
      notes: accommodationData.description || '',
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding accommodation:', error);
    throw new Error(error.response?.data?.message || 'Failed to add accommodation');
  }
};

export const addTransport = async (destinationId, transportData) => {
  try {
    const response = await api.post(`/destinations/${destinationId}/transport`, {
      type: transportData.type,
      details: transportData.name,
      time: new Date(`${transportData.date}T${transportData.time}`).toISOString(),
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding transport:', error);
    throw new Error(error.response?.data?.message || 'Failed to add transport');
  }
};

// Additional API functions for itinerary generation and suggestions
export const generateItinerary = async (itineraryData) => {
  try {
    const response = await api.post('/generate-itinerary', {
      destination: itineraryData.destination,
      startDate: itineraryData.startDate,
      endDate: itineraryData.endDate,
      interests: itineraryData.interests,
      budget: itineraryData.budget,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate itinerary');
  }
};

export const getDestinationSuggestions = async (destination) => {
  try {
    const response = await api.get(`/suggestions/${destination}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch suggestions');
  }
};

export const saveItinerary = async (itineraryData) => {
  try {
    const response = await api.post('/save-itinerary', itineraryData);
    return response.data.data;
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw new Error(error.response?.data?.message || 'Failed to save itinerary');
  }
};

export const getUserItineraries = async (userId) => {
  try {
    const response = await api.get(`/itineraries/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch itineraries');
  }
};