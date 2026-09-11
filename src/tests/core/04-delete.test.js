import test, { before, afterEach, after, describe } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import app from "../../app.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit } from "../../analytics/dbInit.js";
import pool from "../../db/pool.js";

pool.options.database = process.env.DB_TEST_DATABASE;

after(async () => await pool.end());

test("db is a test database", async () => {
    try {
        const res = await pool.query("SELECT current_database() AS db_name");
        assert.equal(res.rows[0].db_name, process.env.DB_TEST_DATABASE);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});

describe("DELETE", () => {
    before(async () => {
        await dbTableQuestInit(pool);
        await dbTableTruncateAndCreateSeedQuest(pool);
    });
            
    afterEach(async () => {
        await dbTableTruncateAndCreateSeedQuest(pool);
    });

    test("/quests/1 204 - body is empty", async () => {
        const res = await req(app).delete("/quests/1");
        
        assert.equal(res.status, 204);
        assert.ok(Object.entries(res.body).length === 0);
    });
});