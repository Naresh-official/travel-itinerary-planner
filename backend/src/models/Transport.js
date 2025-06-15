import { pool } from "../config/database.js";

export class Transport {
	static async create({ destinationId, type, details, time }) {
		const [result] = await pool.execute(
			'INSERT INTO transport (destination_id, type, details, time) VALUES (?, ?, ?, ?)',
			[destinationId, type, details, time]
		);
		
		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(`
			SELECT * FROM transport WHERE id = ?
		`, [id]);
		
		if (rows[0]) {
			return {
				_id: rows[0].id,
				destinationId: rows[0].destination_id,
				type: rows[0].type,
				details: rows[0].details,
				time: rows[0].time,
				createdAt: rows[0].created_at,
				updatedAt: rows[0].updated_at
			};
		}
		return null;
	}

	static async findByDestinationId(destinationId) {
		const [rows] = await pool.execute(`
			SELECT * FROM transport WHERE destination_id = ? ORDER BY time ASC
		`, [destinationId]);

		return rows.map(row => ({
			_id: row.id,
			destinationId: row.destination_id,
			type: row.type,
			details: row.details,
			time: row.time,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		}));
	}

	static async updateById(id, { type, details, time }) {
		const [result] = await pool.execute(
			'UPDATE transport SET type = ?, details = ?, time = ? WHERE id = ?',
			[type, details, time, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			'DELETE FROM transport WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}

	static async deleteByDestinationId(destinationId) {
		const [result] = await pool.execute(
			'DELETE FROM transport WHERE destination_id = ?',
			[destinationId]
		);
		return result.affectedRows;
	}
}