import pg from "pg";
const { Client } = pg;

const client = new Client({
    connectionString: "postgresql://postgres.pgwcznlutgsccerrmoob:571XXQ2Fm5QZoCWx@aws-1-eu-west-3.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

async function checkPassword() {
    try {
        await client.connect();
        const res = await client.query("SELECT username, password FROM users WHERE username = 'admin@test.com'");
        console.log("DB Result:", res.rows);
        await client.end();
    } catch (err) {
        console.error(err);
    }
}

checkPassword();
