import pg from "pg";
const { Client } = pg;

const client = new Client({
    connectionString: "postgresql://postgres.pgwcznlutgsccerrmoob:571XXQ2Fm5QZoCWx@aws-1-eu-west-3.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
    try {
        await client.connect();
        console.log("Connected to Supabase. Checking users...");
        const res = await client.query('SELECT id, username, email, role FROM users');
        console.log("Users in DB:", res.rows);
        await client.end();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUsers();
