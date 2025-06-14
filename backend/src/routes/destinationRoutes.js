import express from "express";
import {
	addActivity,
	addTransport,
	addAccommodation,
} from "../controllers/destinationController.js";

const router = express.Router();

router.post("/:id/activities", addActivity);

router.post("/:id/transport", addTransport);

router.post("/:id/accommodations", addAccommodation);

export default router;
