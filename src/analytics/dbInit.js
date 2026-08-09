import pool from "../db/pool.js";
import fs from "fs/promises";
import path from "path";

await dbInit();

async function dbInit() {
    const sqlCreateTable = await fs.readFile(path.join(process.cwd(), "database", "scheme.sql"), "utf-8");
    const sqlSeed = await fs.readFile(path.join(process.cwd(), "database", "seed.sql"), "utf-8");
    
    await pool.query(sqlCreateTable);
    await pool.query(sqlSeed);
    
    pool.end();
}