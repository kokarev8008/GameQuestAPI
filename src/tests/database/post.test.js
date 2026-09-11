import test, { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import pool from "../../db/pool.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit } from "../../analytics/dbInit.js";
import questRepository from "../../repositories/questRepository.js";

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

    test("create quest", async () => {
        const getResultBefore = await questRepository.getAllQuests();
                
        const postResult = await questRepository.createQuest("hiisfwefwewefwewefwefwefwfewfewfewfefwefwefwefwefwefwewfewfewfewfewfewefffffffff", "hard", 40, "LOLLOLLOLLOLLOLLOLLOLLOLLOLLO");
    
        const getResultAfter = await questRepository.getAllQuests();
                
        assert.equal((getResultBefore.length + 1), getResultAfter.length);
    
        assert.ok(postResult);
    
        assert.ok(Object.hasOwn(postResult, "id"));
        assert.ok(Object.hasOwn(postResult, "createdAt"));
        assert.ok(Object.hasOwn(postResult, "completed"));
    
        assert.ok(postResult.completed === false);
        assert.ok(typeof postResult.rewardXp === "number");
    }); 
    
    test("title 81 error", async () => {
        const getResultBefore = await questRepository.getAllQuests();
    
        const result = await questRepository.createQuest(";sJUP;OSIJUA;EOGFJUA;EPOGJ;EOGUJ;OGUJE;OGJEOGJE'OGJEGAJE'OEJ'EJGADASDASASDASDASDD", "easy", 25);
    
        const getResultAfter = await questRepository.getAllQuests();
    
        assert.equal(result, null);
        assert.deepEqual(getResultBefore, getResultAfter);
    });
    
    test("rewardXp = 0 error", async () => {
        const getResultBefore = await questRepository.getAllQuests();
    
        const result = await questRepository.createQuest("ddd", "easy", 0);
    
        const getResultAfter = await questRepository.getAllQuests();
    
        assert.equal(result, null);
        assert.deepEqual(getResultBefore, getResultAfter);
    
    });
            
    test("difficulty invalid error", async () => {
        const getResultBefore = await questRepository.getAllQuests();
    
        const result = await questRepository.createQuest("ddd", "test", 25);
    
        const getResultAfter = await questRepository.getAllQuests();
    
        assert.equal(result, null);
        assert.deepEqual(getResultBefore, getResultAfter);
    });
});