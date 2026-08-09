import fs from "fs/promises";
import path from "path";

export async function dbTableInit(pool) {
    const sqlCreateTable = await fs.readFile(path.join(process.cwd(), "database", "scheme.sql"), "utf-8");
    
    await pool.query(sqlCreateTable);
}

export async function dbTableTruncateAndCreateSeed(pool) {
    const sqlSeed = await fs.readFile(path.join(process.cwd(), "database", "seed.sql"), "utf-8");
    
    await pool.query(sqlSeed);
}