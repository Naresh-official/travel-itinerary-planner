import Destination from "../models/Destination.js";
import Activity from "../models/Activity.js";
import Transport from "../models/Transport.js";
import Accommodation from "../models/Accommodation.js";

const addActivity = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, time, notes = "" } = req.body;

		if (!title || !time) {
			return res.status(400).json({
				success: false,
				message: "Title and time are required",
			});
		}

		const destination = await Destination.findById(id);
		if (!destination) {
			return res.status(404).json({
				success: false,
				message: "Destination not found",
			});
		}

		const activityTime = new Date(time);
		if (
			activityTime < destination.arrivalDate ||
			activityTime > destination.departureDate
		) {
			return res.status(400).json({
				success: false,
				message: "Activity time must be within destination stay period",
			});
		}

		const activity = new Activity({
			destinationId: id,
			title: title.trim(),
			time: activityTime,
			notes: notes.trim(),
		});

		const savedActivity = await activity.save();

		destination.activities.push(savedActivity._id);
		await destination.save();

		res.status(201).json({
			success: true,
			message: "Activity added successfully",
			data: savedActivity,
		});
	} catch (error) {
		console.error("Add activity error:", error);
		res.status(400).json({
			success: false,
			message: "Failed to add activity",
			error: error.message,
		});
	}
};

const addTransport = async (req, res) => {
	try {
		const { id } = req.params;
		const { type, details, time } = req.body;

		if (!type || !details || !time) {
			return res.status(400).json({
				success: false,
				message: "Type, details, and time are required",
			});
		}

		const validTypes = ["flight", "train", "bus", "car", "boat", "other"];
		if (!validTypes.includes(type.toLowerCase())) {
			return res.status(400).json({
				success: false,
				message: `Invalid transport type. Must be one of: ${validTypes.join(
					", "
				)}`,
			});
		}

		const destination = await Destination.findById(id);
		if (!destination) {
			return res.status(404).json({
				success: false,
				message: "Destination not found",
			});
		}

		const transport = new Transport({
			destinationId: id,
			type: type.toLowerCase(),
			details: details.trim(),
			time: new Date(time),
		});

		const savedTransport = await transport.save();

		destination.transport.push(savedTransport._id);
		await destination.save();

		res.status(201).json({
			success: true,
			message: "Transport added successfully",
			data: savedTransport,
		});
	} catch (error) {
		console.error("Add transport error:", error);
		res.status(400).json({
			success: false,
			message: "Failed to add transport",
			error: error.message,
		});
	}
};

const addAccommodation = async (req, res) => {
	try {
		const { id } = req.params;
		const { placeName, checkIn, checkOut, notes = "" } = req.body;

		if (!placeName || !checkIn || !checkOut) {
			return res.status(400).json({
				success: false,
				message:
					"Place name, check-in, and check-out dates are required",
			});
		}

		const destination = await Destination.findById(id);
		if (!destination) {
			return res.status(404).json({
				success: false,
				message: "Destination not found",
			});
		}

		const checkInDate = new Date(checkIn);
		const checkOutDate = new Date(checkOut);

		if (checkInDate >= checkOutDate) {
			return res.status(400).json({
				success: false,
				message: "Check-out date must be after check-in date",
			});
		}

		if (
			checkInDate < destination.arrivalDate ||
			checkOutDate > destination.departureDate
		) {
			return res.status(400).json({
				success: false,
				message:
					"Accommodation dates must be within destination stay period",
			});
		}

		const accommodation = new Accommodation({
			destinationId: id,
			placeName: placeName.trim(),
			checkIn: checkInDate,
			checkOut: checkOutDate,
			notes: notes.trim(),
		});

		const savedAccommodation = await accommodation.save();

		destination.accommodations.push(savedAccommodation._id);
		await destination.save();

		res.status(201).json({
			success: true,
			message: "Accommodation added successfully",
			data: savedAccommodation,
		});
	} catch (error) {
		console.error("Add accommodation error:", error);
		res.status(400).json({
			success: false,
			message: "Failed to add accommodation",
			error: error.message,
		});
	}
};

export { addActivity, addTransport, addAccommodation };
