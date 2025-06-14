import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import tripRoutes from "./routes/tripRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGODB_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("Database connection failed:", error.message);
		process.exit(1);
	}
};

connectDB();

app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);

app.get("/api/health", (req, res) => {
	res.json({
		message: "Travel Itinerary API is running!",
		timestamp: new Date().toISOString(),
	});
});

app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

app.use((error, req, res, next) => {
	console.error("Error Details:", error);
	res.status(error.status || 500).json({
		success: false,
		message: error.message || "Internal server error",
		...(process.env.NODE_ENV === "development" && { stack: error.stack }),
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
