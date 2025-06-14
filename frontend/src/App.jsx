import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TripDashboard from "./components/TripDashboard";
import TripItinerary from "./components/TripItinerary";
import ItineraryDayView from "./components/ItineraryDayView";

export default function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/trips" element={<TripDashboard />} />
					<Route path="/trips/:id" element={<TripItinerary />} />
					<Route
						path="/trips/:id/day/:day"
						element={<ItineraryDayView />}
					/>
				</Routes>
			</div>
		</Router>
	);
}
