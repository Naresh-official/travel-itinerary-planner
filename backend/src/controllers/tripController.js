import Trip from "../models/Trip.js";
import Destination from "../models/Destination.js";

const getAllTrips = async (req, res) => {
	try {
		const trips = await Trip.find()
			.populate({
				path: "destinations",
				select: "location arrivalDate departureDate",
			})
			.sort({ startDate: -1 });

		res.json({
			success: true,
			count: trips.length,
			data: trips,
		});
	} catch (error) {
		console.error("Get all trips error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch trips",
			error: error.message,
		});
	}
};

const createTrip = async (req, res) => {
	try {
		const { name, startDate, endDate } = req.body;

		if (!name || !startDate || !endDate) {
			return res.status(400).json({
				success: false,
				message: "Name, start date, and end date are required",
			});
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (start >= end) {
			return res.status(400).json({
				success: false,
				message: "End date must be after start date",
			});
		}

		const trip = new Trip({
			name: name.trim(),
			startDate: start,
			endDate: end,
		});

		const savedTrip = await trip.save();

		res.status(201).json({
			success: true,
			message: "Trip created successfully",
			data: savedTrip,
		});
	} catch (error) {
		console.error("Create trip error:", error);
		res.status(400).json({
			success: false,
			message: "Failed to create trip",
			error: error.message,
		});
	}
};

const getTripById = async (req, res) => {
	try {
		const { id } = req.params;

		const trip = await Trip.findById(id).populate({
			path: "destinations",
			populate: [
				{ path: "activities", options: { sort: { time: 1 } } },
				{ path: "transport", options: { sort: { time: 1 } } },
				{ path: "accommodations", options: { sort: { checkIn: 1 } } },
			],
		});

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found",
			});
		}

		res.json({
			success: true,
			data: trip,
		});
	} catch (error) {
		console.error("Get trip by ID error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch trip details",
			error: error.message,
		});
	}
};

const addDestinationToTrip = async (req, res) => {
	try {
		const { id } = req.params;
		const { location, arrivalDate, departureDate } = req.body;

		if (!location || !arrivalDate || !departureDate) {
			return res.status(400).json({
				success: false,
				message:
					"Location, arrival date, and departure date are required",
			});
		}

		const trip = await Trip.findById(id);
		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found",
			});
		}

		const arrival = new Date(arrivalDate);
		const departure = new Date(departureDate);

		if (arrival >= departure) {
			return res.status(400).json({
				success: false,
				message: "Departure date must be after arrival date",
			});
		}

		if (arrival < trip.startDate || departure > trip.endDate) {
			return res.status(400).json({
				success: false,
				message: "Destination dates must be within trip dates",
			});
		}

		const destination = new Destination({
			tripId: id,
			location: location.trim(),
			arrivalDate: arrival,
			departureDate: departure,
		});

		const savedDestination = await destination.save();

		trip.destinations.push(savedDestination._id);
		await trip.save();

		res.status(201).json({
			success: true,
			message: "Destination added successfully",
			data: savedDestination,
		});
	} catch (error) {
		console.error("Add destination error:", error);
		res.status(400).json({
			success: false,
			message: "Failed to add destination",
			error: error.message,
		});
	}
};

export { getAllTrips, createTrip, getTripById, addDestinationToTrip };
