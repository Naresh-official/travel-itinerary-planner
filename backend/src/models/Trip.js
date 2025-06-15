import { pool } from "../config/database.js";

export class Trip {
	static async create({ name, startDate, endDate }) {
		const [result] = await pool.execute(
			'INSERT INTO trips (name, start_date, end_date) VALUES (?, ?, ?)',
			[name, startDate, endDate]
		);
		
		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(`
			SELECT * FROM trips WHERE id = ?
		`, [id]);
		
		if (rows[0]) {
			const trip = {
				_id: rows[0].id,
				name: rows[0].name,
				startDate: rows[0].start_date,
				endDate: rows[0].end_date,
				createdAt: rows[0].created_at,
				updatedAt: rows[0].updated_at,
				destinations: []
			};

			// Calculate duration
			const start = new Date(trip.startDate);
			const end = new Date(trip.endDate);
			const diffTime = Math.abs(end - start);
			trip.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return trip;
		}
		return null;
	}

	static async findAll() {
		const [rows] = await pool.execute(`
			SELECT t.*, 
				   COUNT(d.id) as destination_count
			FROM trips t
			LEFT JOIN destinations d ON t.id = d.trip_id
			GROUP BY t.id
			ORDER BY t.start_date DESC
		`);

		return rows.map(row => {
			const trip = {
				_id: row.id,
				name: row.name,
				startDate: row.start_date,
				endDate: row.end_date,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
				destinations: []
			};

			// Calculate duration
			const start = new Date(trip.startDate);
			const end = new Date(trip.endDate);
			const diffTime = Math.abs(end - start);
			trip.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return trip;
		});
	}

	static async findByIdWithDestinations(id) {
		// Get trip details
		const trip = await this.findById(id);
		if (!trip) return null;

		// Get destinations with their activities, transport, and accommodations
		const [destinations] = await pool.execute(`
			SELECT * FROM destinations WHERE trip_id = ? ORDER BY arrival_date ASC
		`, [id]);

		for (const dest of destinations) {
			const destination = {
				_id: dest.id,
				tripId: dest.trip_id,
				location: dest.location,
				arrivalDate: dest.arrival_date,
				departureDate: dest.departure_date,
				createdAt: dest.created_at,
				updatedAt: dest.updated_at,
				activities: [],
				transport: [],
				accommodations: []
			};

			// Calculate stay duration
			const arrival = new Date(destination.arrivalDate);
			const departure = new Date(destination.departureDate);
			const diffTime = Math.abs(departure - arrival);
			destination.stayDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			// Get activities
			const [activities] = await pool.execute(`
				SELECT * FROM activities WHERE destination_id = ? ORDER BY time ASC
			`, [dest.id]);

			destination.activities = activities.map(activity => ({
				_id: activity.id,
				destinationId: activity.destination_id,
				title: activity.title,
				time: activity.time,
				notes: activity.notes,
				createdAt: activity.created_at,
				updatedAt: activity.updated_at
			}));

			// Get transport
			const [transport] = await pool.execute(`
				SELECT * FROM transport WHERE destination_id = ? ORDER BY time ASC
			`, [dest.id]);

			destination.transport = transport.map(t => ({
				_id: t.id,
				destinationId: t.destination_id,
				type: t.type,
				details: t.details,
				time: t.time,
				createdAt: t.created_at,
				updatedAt: t.updated_at
			}));

			// Get accommodations
			const [accommodations] = await pool.execute(`
				SELECT * FROM accommodations WHERE destination_id = ? ORDER BY check_in ASC
			`, [dest.id]);

			destination.accommodations = accommodations.map(acc => ({
				_id: acc.id,
				destinationId: acc.destination_id,
				placeName: acc.place_name,
				checkIn: acc.check_in,
				checkOut: acc.check_out,
				notes: acc.notes,
				createdAt: acc.created_at,
				updatedAt: acc.updated_at,
				// Calculate nights
				nights: Math.ceil(Math.abs(new Date(acc.check_out) - new Date(acc.check_in)) / (1000 * 60 * 60 * 24))
			}));

			trip.destinations.push(destination);
		}

		return trip;
	}

	static async updateById(id, { name, startDate, endDate }) {
		const [result] = await pool.execute(
			'UPDATE trips SET name = ?, start_date = ?, end_date = ? WHERE id = ?',
			[name, startDate, endDate, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			'DELETE FROM trips WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}
}