import mongoose from "mongoose";
const transportSchema = new mongoose.Schema(
	{
		destinationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Destination",
			required: [true, "Destination ID is required"],
		},
		type: {
			type: String,
			required: [true, "Transport type is required"],
			enum: ["flight", "train", "bus", "car", "boat", "other"],
			lowercase: true,
		},
		details: {
			type: String,
			required: [true, "Transport details are required"],
			trim: true,
			maxlength: [300, "Transport details cannot exceed 300 characters"],
		},
		time: {
			type: Date,
			required: [true, "Transport time is required"],
		},
	},
	{
		timestamps: true,
	}
);

transportSchema.index({ destinationId: 1, time: 1 });

export default mongoose.model("Transport", transportSchema);
