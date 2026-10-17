import test, { before, afterEach, describe, after, } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import { patchQuestFixtures } from "../fixtures/patch/patchStorage.js";
import app from "../../app.js";
import pool from "../../db/pool.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit } from "../../analytics/dbInit.js";
import questRepository from "../../repositories/questRepository.js";

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

describe("PATCH", () => {
    before(async () => {
        await dbTableQuestInit(pool);
        await dbTableTruncateAndCreateSeedQuest(pool);
    });
        
    afterEach(async () => {
        await dbTableTruncateAndCreateSeedQuest(pool);
    });
    
    test("/quests/1 200 - valid", async () => {
        const beforeQuest = await questRepository.getQuestById(1);
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.valid.allValid);   
        
        assert.equal(resPatch.status, 200);
        assert.notDeepEqual(resPatch.body, beforeQuest);
    });
    
    test("/quests/1 200 + description cleared", async () => {
        const beforeQuest = await questRepository.getQuestById(1);

        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.valid.decriptionCleared);
    
        assert.equal(resPatch.status, 200);
    
        assert.equal(resPatch.body.description, "");
    
        assert.notDeepEqual(resPatch.body, beforeQuest);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - id/createdAt/unknownField", async () => {
        const beforeQuest = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.idCreatedAtUnknownField);
        
        assert.equal(resPatch.status, 400);
        
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(resPatch.body.error.details, "id"));
        assert.ok(Object.hasOwn(resPatch.body.error.details, "createdAt"));
        assert.ok(Object.hasOwn(resPatch.body.error.details, "unknownField"));
    
        const afterQuest = await questRepository.getQuestById(1);
    
        assert.deepEqual(beforeQuest, afterQuest);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - empty body", async () => {
        const beforeQuest = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.emptyBody);
    
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
        assert.equal(resPatch.body.error.details, "null");
    
        const afterQuest = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeQuest, afterQuest);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - title type", async () => {
        const beforeQuest = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.titleType);
        
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(resPatch.body.error.details, "title"));
    
        const afterQuest = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeQuest, afterQuest);
    
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - title Length > 80", async () => {
        const beforeData = await questRepository.getQuestById(1);

        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.titleLength80);

        const afterData = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeData, afterData);

        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(resPatch.body.error.details.field);
        assert.ok(resPatch.body.error.details.field === "title");
    
        assert.ok(resPatch.body.error.details.max);
        assert.ok(resPatch.body.error.details.max === 80);
        assert.ok(resPatch.body.error.details.data.length > 80);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - rewardXp is string", async () => {
        const beforeData = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.rewardXpIsStr);
        
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(resPatch.body.error.details, "rewardXp")); 
    
        const afterData = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeData, afterData);
    
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - description length > 300", async () => {
        const beforeData = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.decriptionLengthAlot);
        
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(resPatch.body.error.details.field === "description"); 
    
        const afterData = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeData, afterData);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - descriptionType", async () => {
        const beforeData = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.decriptionType);
        
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(resPatch.body.error.details, "description"));
    
        const afterData = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeData, afterData);
    });
    
    test("/quests/1 400 + VALIDATION_ERROR - completed is string", async () => {
        const beforeData = await questRepository.getQuestById(1);
    
        const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.completedType);
        
        assert.equal(resPatch.status, 400);
    
        assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    
        assert.ok(Object.hasOwn(resPatch.body.error.details, "completed"));
    
        const afterData = await questRepository.getQuestById(1);
        
        assert.deepEqual(beforeData, afterData);
    });
});
