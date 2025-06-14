"use client"

import { useState } from "react"
import { Calendar, MapPin, Plus, Bed, Car, Activity, AlertCircle } from "lucide-react"
import ActivityCard from "./ActivityCard"
import ActivityForm from "./ActivityForm"
import AccommodationForm from "./AccommodationForm"
import TransportForm from "./TransportForm"
import { addActivity, addAccommodation, addTransport } from "../services/api"

export default function DestinationCard({ destination }) {
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showAccommodationForm, setShowAccommodationForm] = useState(false)
  const [showTransportForm, setShowTransportForm] = useState(false)
  const [localDestination, setLocalDestination] = useState(destination)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState({
    activity: false,
    accommodation: false,
    transport: false,
  })

  const handleAddActivity = async (activityData) => {
    try {
      setLoading({ ...loading, activity: true })
      setError(null)
      const newActivity = await addActivity(destination.id, activityData)
      setLocalDestination({
        ...localDestination,
        activities: [...(localDestination.activities || []), newActivity],
      })
      setShowActivityForm(false)
    } catch (error) {
      console.error("Error adding activity:", error)
      setError(error.message)
    } finally {
      setLoading({ ...loading, activity: false })
    }
  }

  const handleAddAccommodation = async (accommodationData) => {
    try {
      setLoading({ ...loading, accommodation: true })
      setError(null)
      const newAccommodation = await addAccommodation(destination.id, accommodationData)
      setLocalDestination({
        ...localDestination,
        accommodations: [...(localDestination.accommodations || []), newAccommodation],
      })
      setShowAccommodationForm(false)
    } catch (error) {
      console.error("Error adding accommodation:", error)
      setError(error.message)
    } finally {
      setLoading({ ...loading, accommodation: false })
    }
  }

  const handleAddTransport = async (transportData) => {
    try {
      setLoading({ ...loading, transport: true })
      setError(null)
      const newTransport = await addTransport(destination.id, transportData)
      setLocalDestination({
        ...localDestination,
        transport: [...(localDestination.transport || []), newTransport],
      })
      setShowTransportForm(false)
    } catch (error) {
      console.error("Error adding transport:", error)
      setError(error.message)
    } finally {
      setLoading({ ...loading, transport: false })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{localDestination.location}</h3>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(localDestination.arrivalDate)} - {formatDate(localDestination.departureDate)}
            </div>
            {localDestination.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {localDestination.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {localDestination.description && <p className="text-gray-600 mb-6">{localDestination.description}</p>}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Activities Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Activities
            </h4>
            <button
              onClick={() => setShowActivityForm(true)}
              disabled={loading.activity}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              title="Add Activity"
            >
              {loading.activity ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {localDestination.activities && localDestination.activities.length > 0 ? (
              localDestination.activities.map((activity) => (
                <ActivityCard key={activity._id || activity.id} activity={activity} type="activity" />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No activities planned</p>
            )}
          </div>
        </div>

        {/* Accommodations Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bed className="h-5 w-5 mr-2 text-green-600" />
              Accommodations
            </h4>
            <button
              onClick={() => setShowAccommodationForm(true)}
              disabled={loading.accommodation}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              title="Add Accommodation"
            >
              {loading.accommodation ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {localDestination.accommodations && localDestination.accommodations.length > 0 ? (
              localDestination.accommodations.map((accommodation) => (
                <ActivityCard key={accommodation._id || accommodation.id} activity={accommodation} type="accommodation" />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No accommodations booked</p>
            )}
          </div>
        </div>

        {/* Transport Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Car className="h-5 w-5 mr-2 text-purple-600" />
              Transport
            </h4>
            <button
              onClick={() => setShowTransportForm(true)}
              disabled={loading.transport}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              title="Add Transport"
            >
              {loading.transport ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {localDestination.transport && localDestination.transport.length > 0 ? (
              localDestination.transport.map((transport) => (
                <ActivityCard key={transport._id || transport.id} activity={transport} type="transport" />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No transport arranged</p>
            )}
          </div>
        </div>
      </div>

      {/* Forms */}
      {showActivityForm && (
        <ActivityForm onSubmit={handleAddActivity} onCancel={() => setShowActivityForm(false)} type="activity" />
      )}

      {showAccommodationForm && (
        <AccommodationForm onSubmit={handleAddAccommodation} onCancel={() => setShowAccommodationForm(false)} />
      )}

      {showTransportForm && (
        <TransportForm onSubmit={handleAddTransport} onCancel={() => setShowTransportForm(false)} />
      )}
    </div>
  )
}