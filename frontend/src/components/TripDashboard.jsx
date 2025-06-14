"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, AlertCircle } from "lucide-react"
import TripCard from "./TripCard"
import TripForm from "./TripForm"
import { getTrips, createTrip } from "../services/api"

export default function TripDashboard() {
  const [trips, setTrips] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTrips()
      setTrips(data)
    } catch (error) {
      console.error("Error fetching trips:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (tripData) => {
    try {
      setError(null)
      const newTrip = await createTrip(tripData)
      setTrips([newTrip, ...trips])
      setShowForm(false)
    } catch (error) {
      console.error("Error creating trip:", error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">Plan and manage your travel adventures</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Trip
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={fetchTrips}
              className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {trips.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={{ ...trip, id: trip._id }} />
            ))}
          </div>
        )}

        {showForm && <TripForm onSubmit={handleCreateTrip} onCancel={() => setShowForm(false)} />}
      </div>
    </div>
  )
}