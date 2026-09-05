import test, { after, before, describe } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import app from "../../app.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit } from "../../analytics/dbInit.js";
import pool from "../../db/pool.js";

pool.options.database = process.env.DB_TEST_DATABASE;

after(() => pool.end());

test("db is a test database", async () => {
    try {
        const res = await pool.query("SELECT current_database() AS db_name");
        assert.equal(res.rows[0].db_name, process.env.DB_TEST_DATABASE);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});

describe("GET", () => {
    before(async () => {
        await dbTableQuestInit(pool);
        await dbTableTruncateAndCreateSeedQuest(pool);
    });

    test("/quests returns an array", async () => {
        const res = await req(app).get("/quests");
        
        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
    });
    
    test("/quests/1 returns an object", async () => {
        const res = await req(app).get("/quests/1");
        
        assert.equal(res.status, 200);
        assert.ok(res.body);
    });
    
    test("/quests/abc and /quests/0 return 400 + INVALID_QUEST_ID", async () => {
        const resString = await req(app).get("/quests/abc");
        const resNumber = await req(app).get("/quests/0");
        
        assert.equal(resString.status, 400);
        assert.equal(resNumber.status, 400);
    
        assert.equal(resString.body.error.code, ErrorModule.errCodesText.invalidQuestIdText);
        assert.equal(resNumber.body.error.code, ErrorModule.errCodesText.invalidQuestIdText);
    });
    
    test("/quests/999 return 404 + QUEST_NOT_FOUND", async () => {
        const res = await req(app).get("/quests/999");
    
        assert.equal(res.status, 404);
        assert.equal(res.body.error.code, ErrorModule.errCodesText.questNotFoundText);
    });
    
    test("/unknown return 404 + ROUTE_NOT_FOUND", async () => {
        const res = await req(app).get("/unknown");
    
        assert.equal(res.status, 404);
        assert.equal(res.body.error.code, ErrorModule.errCodesText.routeNotFoundText);
    });
    
    describe("/quests?difficulty", () => {
        test("200 - valid (easy)", async () => {
            const res = await req(app).get("/quests?difficulty=easy");
            
            assert.equal(res.status, 200);
            assert.ok(res.body.every((item) => item.difficulty === "easy"));
        });
    
        test("400 + VALIDATION_ERROR - unknown", async () => {
            const res = await req(app).get("/quests?difficulty=unknown");
    
            assert.equal(res.status, 400);
            assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
        });
    });
});
