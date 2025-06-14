import mongoose from "mongoose";
const destinationSchema = new mongoose.Schema(
	{
		tripId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Trip",
			required: [true, "Trip ID is required"],
		},
		location: {
			type: String,
			required: [true, "Location is required"],
			trim: true,
			maxlength: [100, "Location cannot exceed 100 characters"],
		},
		arrivalDate: {
			type: Date,
			required: [true, "Arrival date is required"],
		},
		departureDate: {
			type: Date,
			required: [true, "Departure date is required"],
			validate: {
				validator: function (value) {
					return value > this.arrivalDate;
				},
				message: "Departure date must be after arrival date",
			},
		},
		activities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Activity",
			},
		],
		transport: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Transport",
			},
		],
		accommodations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Accommodation",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

destinationSchema.virtual("stayDuration").get(function () {
	const diffTime = Math.abs(this.departureDate - this.arrivalDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
});

destinationSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		const Activity = mongoose.model("Activity");
		const Transport = mongoose.model("Transport");
		const Accommodation = mongoose.model("Accommodation");

		await Promise.all([
			Activity.deleteMany({ destinationId: this._id }),
			Transport.deleteMany({ destinationId: this._id }),
			Accommodation.deleteMany({ destinationId: this._id }),
		]);
	}
);

export default mongoose.model("Destination", destinationSchema);
