import test from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import app from "../../app.js";

test("GET /quests returns an array", async () => {
    const res = await req(app).get("/quests");
    
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
});

test("GET /quests/1 returns an object", async () => {
    const res = await req(app).get("/quests/1");
    
    assert.equal(res.status, 200);
    assert.ok(res.body);
});

test("GET /quests/abc and /quests/0 return 400 + INVALID_QUEST_ID", async () => {
    const resString = await req(app).get("/quests/abc");
    const resNumber = await req(app).get("/quests/0");
    
    assert.equal(resString.status, 400);
    assert.equal(resNumber.status, 400);

    assert.equal(resString.body.error.code, ErrorModule.errCodesText.invalidQuestIdText);
    assert.equal(resNumber.body.error.code, ErrorModule.errCodesText.invalidQuestIdText);
});

test("GET /quests/999 return 404 + QUEST_NOT_FOUND", async () => {
    const res = await req(app).get("/quests/999");

    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, ErrorModule.errCodesText.questNotFoundText);
});

test("GET /unknown return 404 + ROUTE_NOT_FOUND", async () => {
    const res = await req(app).get("/unknown");

    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, ErrorModule.errCodesText.routeNotFoundText);
});