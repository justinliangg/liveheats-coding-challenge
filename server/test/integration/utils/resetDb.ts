import { Client } from "pg";

/**
 * Resets the database by truncating all tables.
 */
export const resetDB = async () => {
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    try {
        // Fetch all table names
        const { rows: tables } = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);

        // Begin a transaction
        await client.query("BEGIN");

        // Disable foreign key constraints
        await client.query("SET session_replication_role = replica;");

        // Truncate tables
        for (const { table_name } of tables) {
            await client.query(
                `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE;`
            );
        }

        // Enable foreign key constraints
        await client.query("SET session_replication_role = DEFAULT;");

        // Commit the transaction
        await client.query("COMMIT");
    } catch (err) {
        console.error("Error truncating tables:", err);
        // Rollback transaction in case of error
        await client.query("ROLLBACK");
    } finally {
        await client.end();
    }
};
