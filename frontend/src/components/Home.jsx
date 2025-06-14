import { Link } from "react-router-dom"
import { MapPin, Calendar, Plane } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Plane className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">Travel Itinerary Planner</h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Plan your perfect trip with our comprehensive itinerary planner. Organize destinations, activities,
            accommodations, and transport all in one place.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Plan Destinations</h3>
              <p className="text-gray-600">Add and organize your travel destinations with dates</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Schedule Activities</h3>
              <p className="text-gray-600">Plan activities, accommodations, and transport</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Plane className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Day-by-Day View</h3>
              <p className="text-gray-600">See your complete itinerary in timeline format</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link
              to="/trips"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              View My Trips
            </Link>

            <Link
              to="/trips"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-blue-200"
            >
              Create New Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
