import {
	Clock,
	MapPin,
	DollarSign,
	Calendar,
	BedDouble,
	Plane,
} from "lucide-react";

export default function ActivityCard({ activity, type }) {
	const getTypeStyles = () => {
		switch (type) {
			case "activity":
				return "border-l-4 border-l-blue-500 bg-blue-50";
			case "accommodation":
				return "border-l-4 border-l-green-500 bg-green-50";
			case "transport":
				return "border-l-4 border-l-purple-500 bg-purple-50";
			default:
				return "border-l-4 border-l-gray-500 bg-gray-50";
		}
	};

	const formatDateTime = (datetime) =>
		new Date(datetime).toLocaleString(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		});

	const formatDate = (date) =>
		new Date(date).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	return (
		<div className={`p-4 rounded-lg ${getTypeStyles()}`}>
			<h5 className="font-semibold text-gray-900 mb-2">
				{activity.title ||
					activity.name ||
					activity.placeName ||
					activity.details ||
					"Untitled"}
			</h5>

			{activity.description && (
				<p className="text-gray-600 text-sm mb-3">
					{activity.description}
				</p>
			)}

			<div className="space-y-1 text-xs text-gray-500">
				{/* Activity time or check-in/check-out */}
				{type === "activity" && activity.time && (
					<div className="flex items-center">
						<Clock className="h-3 w-3 mr-1" />
						{formatDateTime(activity.time)}
					</div>
				)}

				{type === "accommodation" &&
					activity.checkIn &&
					activity.checkOut && (
						<>
							<div className="flex items-center">
								<BedDouble className="h-3 w-3 mr-1" />
								Check-In: {formatDate(activity.checkIn)}
							</div>
							<div className="flex items-center">
								<BedDouble className="h-3 w-3 mr-1" />
								Check-Out: {formatDate(activity.checkOut)}
							</div>
							<div className="flex items-center">
								<Clock className="h-3 w-3 mr-1" />
								{activity.nights} night
								{activity.nights > 1 ? "s" : ""}
							</div>
						</>
					)}

				{type === "transport" && activity.time && (
					<div className="flex items-center">
						<Plane className="h-3 w-3 mr-1" />
						{formatDateTime(activity.time)}
					</div>
				)}

				{/* Generic fields */}
				{activity.location && (
					<div className="flex items-center">
						<MapPin className="h-3 w-3 mr-1" />
						{activity.location}
					</div>
				)}

				{activity.date && (
					<div className="flex items-center">
						<Calendar className="h-3 w-3 mr-1" />
						{formatDate(activity.date)}
					</div>
				)}

				{activity.cost && (
					<div className="flex items-center font-semibold text-green-600">
						<DollarSign className="h-3 w-3 mr-1" />
						{activity.cost}
					</div>
				)}

				{/* Special case: show flight details or from → to if available */}
				{type === "transport" && (
					<div className="text-gray-600">
						{activity.details && (
							<div>Details: {activity.details}</div>
						)}
						{activity.from && activity.to && (
							<div>
								{activity.from} → {activity.to}
							</div>
						)}
					</div>
				)}

				{/* Notes (optional) */}
				{activity.notes && activity.notes.trim() !== "" && (
					<p className="text-gray-500 italic text-xs">
						Note: {activity.notes}
					</p>
				)}
			</div>
		</div>
	);
}
