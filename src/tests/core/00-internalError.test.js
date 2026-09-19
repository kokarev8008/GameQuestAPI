import test, { after, describe, before, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit } from "../../analytics/dbInit.js";
import pool from "../../db/pool.js";
import app from "../../app.js";

pool.options.database = process.env.DB_TEST_DATABASE;

after(async () => await pool.end())

test("db is a test database", async () => {
    try {
        const res = await pool.query("SELECT current_database() AS db_name");
        assert.equal(res.rows[0].db_name, process.env.DB_TEST_DATABASE);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});

describe("INTERNAL_ERROR", () => {
    before(async () => {
        await dbTableQuestInit(pool);
        await dbTableTruncateAndCreateSeedQuest(pool);
        pool.test = 0;
    });

    afterEach(async () => {
        await dbTableTruncateAndCreateSeedQuest(pool);
    });

    test("INTERNAL_ERROR + 500 through GET /quests - dbError", async () => {
        const res = await req(app).get("/quests");
    
        assert.equal(res.status, 500);
        assert.equal(res.body.error.code, ErrorModule.errCodesText.internalErrorText);
        assert.equal(res.body.error.details, null);
    });
});
