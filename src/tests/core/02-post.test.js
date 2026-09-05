import test, { before, afterEach, after, describe } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { postQuestFixtures } from "../fixtures/post/postStorage.js";
import { ErrorModule } from "../../err/ErrorModule.js";
import pool from "../../db/pool.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit, dbTruncateTableQuest } from "../../analytics/dbInit.js";
import app from "../../app.js";

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

describe("POST", () => {
    before(async () => {
        await dbTableQuestInit(pool);
        await dbTableTruncateAndCreateSeedQuest(pool);
    });
        
    afterEach(async () => {
        await dbTableTruncateAndCreateSeedQuest(pool);
    });

    test("/quests 201 + create quest with id/createdAt/completed/ description by default", async () => {
        const res = await req(app).post("/quests").send(postQuestFixtures.valid);
        
        assert.equal(res.status, 201);
        assert.ok(Object.hasOwn(res.body, "id"));
        assert.ok(Object.hasOwn(res.body, "createdAt"));
        assert.ok(Object.hasOwn(res.body, "completed"));
        assert.ok(Object.hasOwn(res.body, "description"));
    });
    
    test("/quests 400 + VALIDATION_ERROR - title missing", async () => {
        const res = await req(app).post("/quests").send(postQuestFixtures.invalid.titleMissing);
        
        assert.equal(res.status, 400);
    
        assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
        
        assert.ok(res.body.error.details.title);
    });
    
    test("/quests 400 + VALIDATION_ERROR - rewardXp string", async () => {
        const res = await req(app).post("/quests").send(postQuestFixtures.invalid.rewardXpString);
    
        assert.equal(res.status, 400);
    
        assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
    });
    
    test("/quests 400 + VALIDATION_ERROR - rewardXp=0, decimal, wrong difficulty", async () => {
        const res1 = await req(app).post("/quests").send(postQuestFixtures.invalid.rewardXpZeroDifficuluty);
        const res2 = await req(app).post("/quests").send(postQuestFixtures.invalid.rewardXpDecimal);
    
        assert.equal(res1.status, 400);
        assert.equal(res2.status, 400);
    
        assert.equal(res1.body.error.code, ErrorModule.errCodesText.validErrorText);
        assert.equal(res2.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(res1.body.error.details, "difficulty"));
        assert.ok(Object.hasOwn(res1.body.error.details, "rewardXp"));
        assert.ok(Object.hasOwn(res2.body.error.details, "rewardXp"));
    });
    
    test("/quests 400 + VALIDATION_ERROR - completed/id/createdAt/unknownField", async () => {
        const res = await req(app).post("/quests").send(postQuestFixtures.invalid.completedIdCreatedAtUnknownField);
    
        assert.equal(res.status, 400);
    
        assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
    });
    
    describe("/quests - description", () => {
        test("400 + VALIDATION_ERROR - is not a string", async () => {
            const res = await req(app).post("/quests").send(postQuestFixtures.invalid.descriptionType);
            
            assert.equal(res.status, 400);
            assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
        });
    
        test("400 + VALIDATION_ERROR - length > 300", async () => {
            const res = await req(app).post("/quests").send(postQuestFixtures.invalid.descriptionLength);
            
            assert.equal(res.status, 400);
            assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
        });
    });
});

