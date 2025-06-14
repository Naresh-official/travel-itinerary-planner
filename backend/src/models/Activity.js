import mongoose from "mongoose";
const activitySchema = new mongoose.Schema(
	{
		destinationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Destination",
			required: [true, "Destination ID is required"],
		},
		title: {
			type: String,
			required: [true, "Activity title is required"],
			trim: true,
			maxlength: [150, "Activity title cannot exceed 150 characters"],
		},
		time: {
			type: Date,
			required: [true, "Activity time is required"],
		},
		notes: {
			type: String,
			trim: true,
			maxlength: [500, "Notes cannot exceed 500 characters"],
		},
	},
	{
		timestamps: true,
	}
);

activitySchema.index({ destinationId: 1, time: 1 });

export default mongoose.model("Activity", activitySchema);
