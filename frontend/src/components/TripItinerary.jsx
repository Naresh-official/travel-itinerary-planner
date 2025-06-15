"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, MapPin, AlertCircle } from "lucide-react";
import DestinationCard from "./DestinationCard";
import DestinationForm from "./DestinationForm";
import { getTripById, addDestination } from "../services/api";

export default function TripItinerary() {
	const { id } = useParams();
	const [trip, setTrip] = useState(null);
	const [showDestinationForm, setShowDestinationForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchTrip = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getTripById(id);
			setTrip(data);
		} catch (error) {
			console.error("Error fetching trip:", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchTrip();
	}, [id, fetchTrip]);

	const handleAddDestination = async (destinationData) => {
		try {
			setError(null);
			const newDestination = await addDestination(id, destinationData);
			setTrip({
				...trip,
				destinations: [...(trip.destinations || []), newDestination],
			});
			setShowDestinationForm(false);
		} catch (error) {
			console.error("Error adding destination:", error);
			setError(error.message);
		}
	};

	const getDayViewDates = () => {
		if (!trip?.destinations) return [];

		const dates = new Set();
		trip.destinations.forEach((dest) => {
			const start = new Date(dest.arrivalDate);
			const end = new Date(dest.departureDate);

			for (
				let d = new Date(start);
				d <= end;
				d.setDate(d.getDate() + 1)
			) {
				dates.add(d.toISOString().split("T")[0]);
			}
		});

		return Array.from(dates).sort();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading trip details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Error Loading Trip
					</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<div className="space-x-4">
						<button
							onClick={fetchTrip}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Try Again
						</button>
						<Link
							to="/trips"
							className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Back to Trips
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (!trip) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Trip not found
					</h2>
					<Link
						to="/trips"
						className="text-blue-600 hover:text-blue-800"
					>
						Back to trips
					</Link>
				</div>
			</div>
		);
	}

	const dayViewDates = getDayViewDates();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<Link
						to="/trips"
						className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Trips
					</Link>

					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{trip.name}
						</h1>
						{trip.description && (
							<p className="text-gray-600 mb-4">
								{trip.description}
							</p>
						)}

						<div className="flex items-center space-x-6 text-sm text-gray-500">
							<div className="flex items-center">
								<Calendar className="h-4 w-4 mr-1" />
								{new Date(
									trip.startDate
								).toLocaleDateString()}{" "}
								- {new Date(trip.endDate).toLocaleDateString()}
							</div>
							<div className="flex items-center">
								<MapPin className="h-4 w-4 mr-1" />
								{trip.destinations?.length || 0} destinations
							</div>
						</div>
					</div>

					{dayViewDates.length > 0 && (
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h2 className="text-xl font-semibold mb-4">
								Day-by-Day View
							</h2>
							<div className="flex flex-wrap gap-2">
								{dayViewDates.map((date, index) => (
									<Link
										key={date}
										to={`/trips/${id}/day/${date}`}
										className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
									>
										Day {index + 1} (
										{new Date(date).toLocaleDateString()})
									</Link>
								))}
							</div>
						</div>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
							<AlertCircle className="h-5 w-5 text-red-600 mr-2" />
							<span className="text-red-700">{error}</span>
						</div>
					)}
				</div>

				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">
						Destinations
					</h2>
					<button
						onClick={() => setShowDestinationForm(true)}
						className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Destination
					</button>
				</div>

				{trip.destinations && trip.destinations.length > 0 ? (
					<div className="space-y-6">
						{trip.destinations.map((destination) => (
							<DestinationCard
								key={destination._id}
								destination={{
									...destination,
									id: destination._id,
								}}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
							<MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No destinations yet
							</h3>
							<p className="text-gray-600 mb-6">
								Add your first destination to start planning!
							</p>
							<button
								onClick={() => setShowDestinationForm(true)}
								className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
							>
								<Plus className="h-5 w-5 mr-2" />
								Add Destination
							</button>
						</div>
					</div>
				)}

				{showDestinationForm && (
					<DestinationForm
						onSubmit={handleAddDestination}
						onCancel={() => setShowDestinationForm(false)}
					/>
				)}
			</div>
		</div>
	);
}
