import express from "express";
import {
	getAllTrips,
	createTrip,
	getTripById,
	addDestinationToTrip,
} from "../controllers/tripController.js";
const router = express.Router();

router.get("/", getAllTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);
router.post("/:id/destinations", addDestinationToTrip);

export default router;
