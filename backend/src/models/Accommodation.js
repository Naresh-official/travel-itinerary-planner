import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema(
	{
		destinationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Destination",
			required: [true, "Destination ID is required"],
		},
		placeName: {
			type: String,
			required: [true, "Place name is required"],
			trim: true,
			maxlength: [150, "Place name cannot exceed 150 characters"],
		},
		checkIn: {
			type: Date,
			required: [true, "Check-in date is required"],
		},
		checkOut: {
			type: Date,
			required: [true, "Check-out date is required"],
			validate: {
				validator: function (value) {
					return value > this.checkIn;
				},
				message: "Check-out date must be after check-in date",
			},
		},
		notes: {
			type: String,
			trim: true,
			maxlength: [500, "Notes cannot exceed 500 characters"],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

accommodationSchema.virtual("nights").get(function () {
	const diffTime = Math.abs(this.checkOut - this.checkIn);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
});

accommodationSchema.index({ destinationId: 1 });

export default mongoose.model("Accommodation", accommodationSchema);
