import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./config/database.js";

import tripRoutes from "./routes/tripRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
const connectDB = async () => {
	try {
		await initDatabase();
		console.log("MySQL Database connected and initialized successfully");
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
		database: "MySQL",
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