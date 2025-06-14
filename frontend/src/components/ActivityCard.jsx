import { Clock, MapPin, DollarSign, Calendar } from "lucide-react"

export default function ActivityCard({ activity, type }) {
  const getTypeStyles = () => {
    switch (type) {
      case "activity":
        return "border-l-4 border-l-blue-500 bg-blue-50"
      case "accommodation":
        return "border-l-4 border-l-green-500 bg-green-50"
      case "transport":
        return "border-l-4 border-l-purple-500 bg-purple-50"
      default:
        return "border-l-4 border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className={`p-4 rounded-lg ${getTypeStyles()}`}>
      <h5 className="font-semibold text-gray-900 mb-2">{activity.name || activity.title}</h5>

      {activity.description && <p className="text-gray-600 text-sm mb-3">{activity.description}</p>}

      <div className="space-y-1 text-xs text-gray-500">
        {activity.time && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {activity.time}
            {activity.duration && ` (${activity.duration})`}
          </div>
        )}

        {activity.location && (
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {activity.location}
          </div>
        )}

        {activity.date && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(activity.date).toLocaleDateString()}
          </div>
        )}

        {activity.cost && (
          <div className="flex items-center font-semibold text-green-600">
            <DollarSign className="h-3 w-3 mr-1" />
            {activity.cost}
          </div>
        )}

        {type === "transport" && activity.from && activity.to && (
          <div className="text-gray-600">
            {activity.from} → {activity.to}
          </div>
        )}
      </div>
    </div>
  )
}
