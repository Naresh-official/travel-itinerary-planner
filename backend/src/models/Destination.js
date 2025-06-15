import { pool } from "../config/database.js";

export class Destination {
	static async create({ tripId, location, arrivalDate, departureDate }) {
		const [result] = await pool.execute(
			'INSERT INTO destinations (trip_id, location, arrival_date, departure_date) VALUES (?, ?, ?, ?)',
			[tripId, location, arrivalDate, departureDate]
		);
		
		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(`
			SELECT * FROM destinations WHERE id = ?
		`, [id]);
		
		if (rows[0]) {
			const destination = {
				_id: rows[0].id,
				tripId: rows[0].trip_id,
				location: rows[0].location,
				arrivalDate: rows[0].arrival_date,
				departureDate: rows[0].departure_date,
				createdAt: rows[0].created_at,
				updatedAt: rows[0].updated_at,
				activities: [],
				transport: [],
				accommodations: []
			};

			// Calculate stay duration
			const arrival = new Date(destination.arrivalDate);
			const departure = new Date(destination.departureDate);
			const diffTime = Math.abs(departure - arrival);
			destination.stayDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return destination;
		}
		return null;
	}

	static async findAll() {
		const [rows] = await pool.execute(`
			SELECT * FROM destinations ORDER BY arrival_date ASC
		`);

		return rows.map(row => {
			const destination = {
				_id: row.id,
				tripId: row.trip_id,
				location: row.location,
				arrivalDate: row.arrival_date,
				departureDate: row.departure_date,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
				activities: [],
				transport: [],
				accommodations: []
			};

			// Calculate stay duration
			const arrival = new Date(destination.arrivalDate);
			const departure = new Date(destination.departureDate);
			const diffTime = Math.abs(departure - arrival);
			destination.stayDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return destination;
		});
	}

	static async updateById(id, { location, arrivalDate, departureDate }) {
		const [result] = await pool.execute(
			'UPDATE destinations SET location = ?, arrival_date = ?, departure_date = ? WHERE id = ?',
			[location, arrivalDate, departureDate, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			'DELETE FROM destinations WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}
}