
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

async function resetAdmin() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Checking for admin user...");
        const res = await pool.query("SELECT * FROM users WHERE username = 'admin@test.com' OR email = 'admin@test.com'");

        if (res.rows.length > 0) {
            console.log("Updating password for user:", res.rows[0].username);
            await pool.query("UPDATE users SET password = $1 WHERE id = $2", ["admin123", res.rows[0].id]);
            console.log("Password reset to 'admin123' successfully!");
        } else {
            console.log("Admin user not found. Creating it...");
            await pool.query(
                "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
                ["admin", "admin@manasik.com", "admin123", "admin"]
            );
            console.log("Admin user created (admin / admin123)");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

resetAdmin();
