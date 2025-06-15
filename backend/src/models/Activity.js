import { pool } from "../config/database.js";

export class Activity {
	static async create({ destinationId, title, time, notes = "" }) {
		const [result] = await pool.execute(
			'INSERT INTO activities (destination_id, title, time, notes) VALUES (?, ?, ?, ?)',
			[destinationId, title, time, notes]
		);
		
		return await this.findById(result.insertId);
	}

	static async findById(id) {
		const [rows] = await pool.execute(`
			SELECT * FROM activities WHERE id = ?
		`, [id]);
		
		if (rows[0]) {
			return {
				_id: rows[0].id,
				destinationId: rows[0].destination_id,
				title: rows[0].title,
				time: rows[0].time,
				notes: rows[0].notes,
				createdAt: rows[0].created_at,
				updatedAt: rows[0].updated_at
			};
		}
		return null;
	}

	static async findByDestinationId(destinationId) {
		const [rows] = await pool.execute(`
			SELECT * FROM activities WHERE destination_id = ? ORDER BY time ASC
		`, [destinationId]);

		return rows.map(row => ({
			_id: row.id,
			destinationId: row.destination_id,
			title: row.title,
			time: row.time,
			notes: row.notes,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		}));
	}

	static async updateById(id, { title, time, notes }) {
		const [result] = await pool.execute(
			'UPDATE activities SET title = ?, time = ?, notes = ? WHERE id = ?',
			[title, time, notes, id]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id) {
		const [result] = await pool.execute(
			'DELETE FROM activities WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}

	static async deleteByDestinationId(destinationId) {
		const [result] = await pool.execute(
			'DELETE FROM activities WHERE destination_id = ?',
			[destinationId]
		);
		return result.affectedRows;
	}
}