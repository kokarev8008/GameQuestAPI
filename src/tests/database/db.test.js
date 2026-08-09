import test, { after, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import pool from "../../db/pool.js";
import app from "../../analytics/analyticsApp.js";

after(() => pool.end());

describe("DB Query", () => {
    describe("GET", () => {
        it("/quests 200 - all quests", async () => {
            const res = await req(app).get("/quests");
            
            console.log(res.body);

            assert.equal(res.status, 200);
            
            assert.ok(Array.isArray(res.body));
        });
        
        it("/quests/1 200 - quest by id", async () => {
            const res = await req(app).get("/quests/1");
        
            assert.equal(res.status, 200);
        });
    });

    describe("POST", () => {
        it("test", async () => {
        }); 
    });
    
});
