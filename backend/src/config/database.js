import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10,
	idleTimeout: 60000,
	queueLimit: 0,
});

export async function initDatabase() {
	try {
		const connection = await pool.getConnection();

		// Trips table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS trips (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
		`);

		// Destinations table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS destinations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        trip_id INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        arrival_date DATETIME NOT NULL,
        departure_date DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
		`);

		// Activities table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS activities (
				id INT PRIMARY KEY AUTO_INCREMENT,
				destination_id INT NOT NULL,
				title VARCHAR(255) NOT NULL,
				time DATETIME NOT NULL,
				notes TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
			)
		`);

		// Transport table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS transport (
				id INT PRIMARY KEY AUTO_INCREMENT,
				destination_id INT NOT NULL,
				type ENUM('flight', 'train', 'bus', 'car', 'boat', 'other') NOT NULL,
				details TEXT NOT NULL,
				time DATETIME NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
			)
		`);

		// Accommodations table
		await connection.execute(`
			CREATE TABLE IF NOT EXISTS accommodations (
				id INT PRIMARY KEY AUTO_INCREMENT,
				destination_id INT NOT NULL,
				place_name VARCHAR(255) NOT NULL,
				check_in DATETIME NOT NULL,
				check_out DATETIME NOT NULL,
				notes TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
			)
		`);

		connection.release();
		console.log("Travel Itinerary database initialized successfully.");
	} catch (error) {
		console.error("Error initializing database:", error);
		throw error;
	}
}
