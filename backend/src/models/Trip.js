import mongoose from "mongoose";
const tripSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Trip name is required"],
			trim: true,
			maxlength: [100, "Trip name cannot exceed 100 characters"],
		},
		startDate: {
			type: Date,
			required: [true, "Start date is required"],
		},
		endDate: {
			type: Date,
			required: [true, "End date is required"],
			validate: {
				validator: function (value) {
					return value > this.startDate;
				},
				message: "End date must be after start date",
			},
		},
		destinations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Destination",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tripSchema.virtual("duration").get(function () {
	const diffTime = Math.abs(this.endDate - this.startDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
});

tripSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		const Destination = mongoose.model("Destination");
		await Destination.deleteMany({ tripId: this._id });
	}
);

export default mongoose.model("Trip", tripSchema);
