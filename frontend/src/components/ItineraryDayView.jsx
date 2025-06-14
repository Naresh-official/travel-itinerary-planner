"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, MapPin, Bed, Car } from "lucide-react"
import { getTripById } from "../services/api"

export default function ItineraryDayView() {
  const { id, day } = useParams()
  const [trip, setTrip] = useState(null)
  const [dayData, setDayData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTripAndDayData()
  }, [id, day])

  const fetchTripAndDayData = async () => {
    try {
      const tripData = await getTripById(id)
      setTrip(tripData)

      // Filter and organize data for the specific day
      const dayItems = []
      const targetDate = new Date(day)

      if (tripData.destinations) {
        tripData.destinations.forEach((destination) => {
          const arrivalDate = new Date(destination.arrivalDate)
          const departureDate = new Date(destination.departureDate)

          if (targetDate >= arrivalDate && targetDate <= departureDate) {
            // Add activities for this day
            if (destination.activities) {
              destination.activities.forEach((activity) => {
                const activityDate = new Date(activity.date)
                if (activityDate.toDateString() === targetDate.toDateString()) {
                  dayItems.push({
                    ...activity,
                    type: "activity",
                    destination: destination.name,
                    time: activity.time || "09:00",
                  })
                }
              })
            }

            // Add accommodations
            if (destination.accommodations) {
              destination.accommodations.forEach((accommodation) => {
                dayItems.push({
                  ...accommodation,
                  type: "accommodation",
                  destination: destination.name,
                  time: "15:00", // Default check-in time
                })
              })
            }

            // Add transport
            if (destination.transport) {
              destination.transport.forEach((transport) => {
                const transportDate = new Date(transport.date)
                if (transportDate.toDateString() === targetDate.toDateString()) {
                  dayItems.push({
                    ...transport,
                    type: "transport",
                    destination: destination.name,
                    time: transport.time || "10:00",
                  })
                }
              })
            }
          }
        })
      }

      // Sort by time
      dayItems.sort((a, b) => a.time.localeCompare(b.time))
      setDayData(dayItems)
    } catch (error) {
      console.error("Error fetching day data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "activity":
        return <MapPin className="h-5 w-5" />
      case "accommodation":
        return <Bed className="h-5 w-5" />
      case "transport":
        return <Car className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "activity":
        return "bg-blue-100 text-blue-800"
      case "accommodation":
        return "bg-green-100 text-green-800"
      case "transport":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading day itinerary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to={`/trips/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip?.name} - Day Itinerary</h1>
            <p className="text-gray-600 mb-4">
              {new Date(day).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {dayData.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Timeline</h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {dayData.map((item, index) => (
                <div key={`${item.type}-${item.id}-${index}`} className="relative flex items-start mb-8">
                  {/* Timeline dot */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${getTypeColor(item.type)} relative z-10`}
                  >
                    {getTypeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="ml-6 flex-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name || item.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.type} • {item.destination}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">{item.time}</div>
                          {item.duration && <div className="text-sm text-gray-500">{item.duration}</div>}
                        </div>
                      </div>

                      {item.description && <p className="text-gray-600 mb-4">{item.description}</p>}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {item.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </div>
                        )}
                        {item.cost && <div className="font-semibold text-green-600">${item.cost}</div>}
                        {item.type === "transport" && item.from && item.to && (
                          <div>
                            {item.from} → {item.to}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities planned</h3>
              <p className="text-gray-600 mb-6">Add some activities, accommodations, or transport for this day!</p>
              <Link
                to={`/trips/${id}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Plan This Day
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
