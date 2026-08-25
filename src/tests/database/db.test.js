import test, { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import pool from "../../db/pool.js";
import { dbTableTruncateAndCreateSeedQuest, dbTableQuestInit, dbTruncateTableQuest } from "../../analytics/dbInit.js";
import questRepository from "../../repositories/questRepository.js";
import app from "../../analytics/analyticsApp.js";

pool.options.database = process.env.DB_TEST_DATABASE;

after(() => pool.end());  

describe("DB query repository", () => {
    it("db is a test database", async () => {
        try {
            const res = await pool.query("SELECT current_database() AS db_name");
            assert.equal(res.rows[0].db_name, process.env.DB_TEST_DATABASE);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
    
    describe("Destructive query", () => {
        before(async () => {
            await dbTableQuestInit(pool);
            await dbTableTruncateAndCreateSeedQuest(pool);
        });
        
        afterEach(async () => {
            await dbTableTruncateAndCreateSeedQuest(pool);
        });

        it("persistance between independents connections", async () => { 
            const client1 = await pool.connect();
            const client2 = await pool.connect();
    
            try {
                const query1 = "INSERT INTO quests (title, difficulty, reward_xp) VALUES ('test', 'easy', 25) RETURNING *";
                const query2 = "SELECT * FROM quests";
    
                const newElementFromClient1 = (await client1.query(query1)).rows[0];
                const result2 = (await client2.query(query2)).rows;
    
                const newElementFromClient2 = result2[result2.length - 1];
    
                assert.deepEqual(newElementFromClient1, newElementFromClient2);
    
            } catch (error) {
                assert.fail(error);   
            } finally {
                client1.release();
                client2.release();
            }
        });
    
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
    
            describe("/quests/stats - Quests stats", () => {
                it("200 - empty table", async () => {
                    await dbTruncateTableQuest(pool);
    
                    const res = await req(app).get("/quests/stats");
                    
                    assert.equal(res.status, 200);
                    assert.ok(res.body);
                    
                    assert.ok(typeof res.body.total === "number" && res.body.total === 0);
                    assert.ok(typeof res.body.completed === "number" && res.body.completed === 0);
                    assert.ok(typeof res.body.active === "number" && res.body.active === 0);
                    assert.ok(typeof res.body.totalRewardXp === "number" && res.body.totalRewardXp === 0);
                    assert.ok(typeof res.body.averageRewardXp === "number" && res.body.averageRewardXp === 0);
                    assert.ok(typeof res.body.byDifficulty.easy === "number" && res.body.byDifficulty.easy === 0);
                    assert.ok(typeof res.body.byDifficulty.medium === "number" && res.body.byDifficulty.medium === 0);
                    assert.ok(typeof res.body.byDifficulty.hard === "number" && res.body.byDifficulty.hard === 0);
                });
    
                it("fixed seed", async () => {
                    const dataFromGetStats = await questRepository.getStats();
                    const dataFromGetQuery = await questRepository.getAllQuests();
    
                    assert.equal(dataFromGetStats.total, dataFromGetQuery.length);
    
                    let completedQuery = 0, activeQuery = 0, totalRewardXpQuery = 0, easyQuery = 0, mediumQuery = 0, hardQuery = 0; 
    
                    for (let i = 0; i < dataFromGetQuery.length; i++) {
                        const element = dataFromGetQuery[i];
                        
                        completedQuery += element.completed === true ? 1 : 0;  
                        activeQuery += element.completed === false ? 1 : 0;
                        totalRewardXpQuery += element.rewardXp;
                        easyQuery += element.difficulty === "easy" ? 1 : 0;
                        mediumQuery += element.difficulty === "medium" ? 1 : 0;
                        hardQuery += element.difficulty === "hard" ? 1 : 0;
                    }                
    
                    const avgRewardXp = parseFloat((totalRewardXpQuery / dataFromGetQuery.length).toFixed(2));
    
                    assert.equal(completedQuery, dataFromGetStats.completed);
                    assert.equal(activeQuery, dataFromGetStats.active);
                    assert.equal(totalRewardXpQuery, dataFromGetStats.totalRewardXp);
                    assert.equal(avgRewardXp, dataFromGetStats.averageRewardXp);
                    assert.equal(easyQuery, dataFromGetStats.byDifficulty.easy);
                    assert.equal(mediumQuery, dataFromGetStats.byDifficulty.medium);
                    assert.equal(hardQuery, dataFromGetStats.byDifficulty.hard);
    
                    assert.ok(dataFromGetStats.completed + dataFromGetStats.active === dataFromGetStats.total);
                });
    
                it("500 + INTERNAL_ERROR - database error", async () => {
                    pool.test = "TEXT_TEST";
    
                    const res = await req(app).get("/quests/stats");
    
                    assert.equal(res.status, 500);
                    assert.equal(res.body.error.code, ErrorModule.errCodesText.internalErrorText);
                    assert.equal(res.body.error.details, null);
    
                    pool.test = undefined;
                });
            });
        });
    
        describe("POST", () => {
            it("create quest", async () => {
                const getResultBefore = await questRepository.getAllQuests();
                
                const postResult = await questRepository.createQuest("hiisfwefwewefwewefwefwefwfewfewfewfefwefwefwefwefwefwewfewfewfewfewfewefffffffff", "hard", 40, "LOLLOLLOLLOLLOLLOLLOLLOLLOLLO");
    
                const getResultAfter = await questRepository.getAllQuests();
                
                assert.ok((getResultBefore.length + 1) === getResultAfter.length);
    
                assert.ok(postResult);
    
                assert.ok(Object.hasOwn(postResult, "id"));
                assert.ok(Object.hasOwn(postResult, "createdAt"));
                assert.ok(Object.hasOwn(postResult, "completed"));
    
                assert.ok(postResult.completed === false);
                assert.ok(typeof postResult.rewardXp === "number");
            }); 
    
            it("title 81 error", async () => {
                const getResultBefore = await questRepository.getAllQuests();
    
                const result = await questRepository.createQuest(";sJUP;OSIJUA;EOGFJUA;EPOGJ;EOGUJ;OGUJE;OGJEOGJE'OGJEGAJE'OEJ'EJGADASDASASDASDASDD", "easy", 25);
    
                const getResultAfter = await questRepository.getAllQuests();
    
                assert.equal(result, null);
                assert.deepEqual(getResultBefore, getResultAfter);
            });
    
            it("rewardXp = 0 error", async () => {
                const getResultBefore = await questRepository.getAllQuests();
    
                const result = await questRepository.createQuest("ddd", "easy", 0);
    
                const getResultAfter = await questRepository.getAllQuests();
    
                assert.equal(result, null);
                assert.deepEqual(getResultBefore, getResultAfter);
    
            });
            
            it("difficulty invalid error", async () => {
                const getResultBefore = await questRepository.getAllQuests();
    
                const result = await questRepository.createQuest("ddd", "test", 25);
    
                const getResultAfter = await questRepository.getAllQuests();
    
                assert.equal(result, null);
                assert.deepEqual(getResultBefore, getResultAfter);
            });
        });
    
        describe("PATCH", () => {
            it("allowed field success", async () => {
                const beforeResult = await questRepository.getQuestById(1);

                const allowedQuest = { 
                    rewardXp: 12412, 
                    completed: true, 
                    difficulty: "medium", 
                    title: "loli", 
                    description: "full house"
                };

                const afterResult = await questRepository.updateQuest(1, allowedQuest);
                const getAfterResult = await questRepository.getQuestById(1);

                assert.ok(afterResult);

                assert.notDeepEqual(beforeResult, afterResult);

                assert.deepEqual(afterResult, getAfterResult);
            });

            it("unknown and protected field", async () => {
                const beforeResult = await questRepository.getQuestById(1);

                const allowedQuest = { 
                    id: 2,
                    createdAt: new Date(),
                    unknown: true
                };

                const result = await questRepository.updateQuest(1, allowedQuest);
                
                const getAfterResult = await questRepository.getQuestById(1);

                assert.equal(result, null);
                assert.deepEqual(beforeResult, getAfterResult);
            });
            
            it("Unknown or protected field and allowed field = null", async () => {
                const beforeResult = await questRepository.getQuestById(1);

                const allowedQuest = { 
                    id: 2,
                    title: "3333",
                    completed: true,
                    createdAt: new Date(),
                    unknown: true
                };

                const result = await questRepository.updateQuest(1, allowedQuest);
                
                const getAfterResult = await questRepository.getQuestById(1);

                assert.equal(result, null);
                assert.deepEqual(beforeResult, getAfterResult);
            });
        });
    
        describe("DELETE", () => {
            it("delete quest by id = 1", async () => {
                const result = await questRepository.deleteQuest(1);
    
                assert.ok(result === null);
            });
        });
    })
});
