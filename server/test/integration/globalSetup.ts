import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";
import { GenericContainer } from "testcontainers";
import { PrismaClient } from "@prisma/client";

declare global {
    var db: PrismaClient | undefined;
}

const setup = async () => {
    const dbContainer = await new GenericContainer("postgres:17")
        .withExposedPorts(5432)
        .withEnvironment({
            POSTGRES_PASSWORD: "password"
        })
        .start();

    // Build database connection string
    const host = dbContainer.getHost();
    const port = dbContainer.getMappedPort(5432);
    const user = "postgres";
    const password = "password";
    const database = "postgres";
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

    // Running migrations on the database
    await runMigrations(connectionString);

    // Create db and set it as global
    const db = new PrismaClient({
        datasources: { db: { url: connectionString } }
    });
    global.db = db;

    // Set ENVs
    process.env.DATABASE_URL = connectionString;
};

const runMigrations = async (connectionString: string) => {
    const client = new Client(connectionString);
    await client.connect();

    const migrationsDir = path.join(__dirname, "../../prisma/migrations");
    const migrationFolders = fs
        .readdirSync(migrationsDir)
        .filter((folder) =>
            fs.statSync(path.join(migrationsDir, folder)).isDirectory()
        );

    // Sort files by timestamp
    const sortedMigrationFolders = migrationFolders.sort((a, b) => {
        const [aTimestamp] = a.split("_", 1);
        const [bTimestamp] = b.split("_", 1);
        return parseInt(aTimestamp) - parseInt(bTimestamp);
    });

    for (const folder of sortedMigrationFolders) {
        const sql = fs.readFileSync(
            path.join(migrationsDir, folder, "migration.sql"),
            "utf8"
        );
        await client.query(sql);
    }

    await client.end();
};

export default setup;
