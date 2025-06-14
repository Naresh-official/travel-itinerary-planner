import { Link } from "react-router-dom"
import { Calendar, MapPin, Clock } from "lucide-react"

export default function TripCard({ trip }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDuration = () => {
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Link to={`/trips/${trip.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{trip.name}</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {getDuration()} days
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{trip.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {trip.destinations?.length || 0} destinations
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-600">View Itinerary →</span>

            {trip.destinations && trip.destinations.length > 0 && (
              <div className="flex -space-x-2">
                {trip.destinations.slice(0, 3).map((dest, index) => (
                  <div
                    key={dest.id}
                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-800 border-2 border-white"
                    title={dest.name}
                  >
                    {dest.name.charAt(0)}
                  </div>
                ))}
                {trip.destinations.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                    +{trip.destinations.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
