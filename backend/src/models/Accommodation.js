import { pool } from "../config/database.js";

export class Accommodation {
	static async create({ destinationId, placeName, checkIn, checkOut, notes = "" }) {
		const [result] = await pool.execute(
			'INSERT INTO accommodations (destination_id, place_name, check_in, check_out, notes) VALUES (?, ?, ?, ?, ?)',
			[destinationId, placeName, checkIn, checkOut, notes]
		);
		
		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(`
			SELECT * FROM accommodations WHERE id = ?
		`, [id]);
		
		if (rows[0]) {
			const accommodation = {
				_id: rows[0].id,
				destinationId: rows[0].destination_id,
				placeName: rows[0].place_name,
				checkIn: rows[0].check_in,
				checkOut: rows[0].check_out,
				notes: rows[0].notes,
				createdAt: rows[0].created_at,
				updatedAt: rows[0].updated_at
			};

			// Calculate nights
			const checkInDate = new Date(accommodation.checkIn);
			const checkOutDate = new Date(accommodation.checkOut);
			const diffTime = Math.abs(checkOutDate - checkInDate);
			accommodation.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return accommodation;
		}
		return null;
	}

	static async findByDestinationId(destinationId) {
		const [rows] = await pool.execute(`
			SELECT * FROM accommodations WHERE destination_id = ? ORDER BY check_in ASC
		`, [destinationId]);

		return rows.map(row => {
			const accommodation = {
				_id: row.id,
				destinationId: row.destination_id,
				placeName: row.place_name,
				checkIn: row.check_in,
				checkOut: row.check_out,
				notes: row.notes,
				createdAt: row.created_at,
				updatedAt: row.updated_at
			};

			// Calculate nights
			const checkInDate = new Date(accommodation.checkIn);
			const checkOutDate = new Date(accommodation.checkOut);
			const diffTime = Math.abs(checkOutDate - checkInDate);
			accommodation.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			return accommodation;
		});
	}

	static async updateById(id, { placeName, checkIn, checkOut, notes }) {
		const [result] = await pool.execute(
			'UPDATE accommodations SET place_name = ?, check_in = ?, check_out = ?, notes = ? WHERE id = ?',
			[placeName, checkIn, checkOut, notes, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			'DELETE FROM accommodations WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}

	static async deleteByDestinationId(destinationId) {
		const [result] = await pool.execute(
			'DELETE FROM accommodations WHERE destination_id = ?',
			[destinationId]
		);
		return result.affectedRows;
	}
}