import test, { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import pool from "../../db/pool.js";
import { dbTableTruncateAndCreateSeed, dbTableInit } from "../../analytics/dbInit.js";
import questRepository from "../../repositories/questRepository.js";

pool.options.database = process.env.DB_TEST_DATABASE;

before(async () => {
    await dbTableInit(pool);
    await dbTableTruncateAndCreateSeed(pool);
});

afterEach(async () => {
    await dbTableTruncateAndCreateSeed(pool);
});

after(() => pool.end());

describe("DB query repository", () => {
    describe("GET", () => {
        it("All quests", async () => {
            const result = await questRepository.getAllQuests();

            assert.ok(Array.isArray(result));
        });
        
        it("Quest by id = 1", async () => {
            const result = await questRepository.getQuestById(1);
            
            assert.ok(result);

            assert.ok(result.id === 1);
        });
    });

    describe("POST", () => {
        it("create quest", async () => {
            const getResultBefore = await questRepository.getAllQuests();
            
            const postResult = await questRepository.createQuest("hii", "hard", 40, "LOLLOLLOLLOLLOLLOLLOLLOLLOLLO");

            const getResultAfter = await questRepository.getAllQuests();
            
            assert.ok((getResultBefore.length + 1) === getResultAfter.length);

            assert.ok(postResult);

            assert.ok(Object.hasOwn(postResult, "id"));
            assert.ok(Object.hasOwn(postResult, "createdAt"));
            assert.ok(Object.hasOwn(postResult, "completed"));

            assert.ok(postResult.completed === false);
            assert.ok(typeof postResult.rewardXp === "number");
        }); 
    });

    describe("PATCH", () => {
        it("update quests by id = 1", async () => {
            const beforeResult = await questRepository.getQuestById(1);

            const afterResult = await questRepository.updateQuest(1, { rewardXp: 12412, completed: true, id: 2, createdAt: new Date() });

            assert.ok(afterResult);

            assert.equal(beforeResult.id, afterResult.id);
            assert.equal(beforeResult.createdAt.toDateString(), afterResult.createdAt.toDateString());

            assert.notDeepEqual(beforeResult, afterResult);
        });
    });

    describe("DELETE", () => {
        it("delete quest by id = 1", async () => {
            const result = await questRepository.deleteQuest(1);

            assert.ok(result === null);
        });
    });
    
});
