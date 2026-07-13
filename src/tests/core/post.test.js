import test, { after, afterEach, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { questFixtures } from "../fixtures/post/postStorage.js";
import { ErrorModule } from "../../err/ErrorModule.js";
import path from "node:path";
import fs from "node:fs";

process.env.DATA_FILE_PATH = path.join(process.cwd(), "src", "tests", "tmp", "quests.json");

const {default: app} = await import("../../app.js");

beforeEach(() => {
    if (fs.statSync(process.env.DATA_FILE_PATH).size > 0) {
        fs.truncateSync(process.env.DATA_FILE_PATH, 0);
    } 
})

afterEach(() => {
    fs.truncateSync(process.env.DATA_FILE_PATH, 0);
});

test("POST /quests 201 + create quest with id/createdAt/completed", async () => {
    const res = await req(app).post("/quests").send(questFixtures.valid);
    
    assert.equal(res.status, 201);
    assert.ok(Object.hasOwn(res.body, "id"));
    assert.ok(Object.hasOwn(res.body, "createdAt"));
    assert.ok(Object.hasOwn(res.body, "completed"));
});

test("POST /quests 400 + VALIDATION_ERROR - title missing", async () => {
    const res = await req(app).post("/quests").send(questFixtures.invalid.titleMissing);

    assert.equal(res.status, 400);
});

test("POST /quests 400 + VALIDATION_ERROR - rewardXp string", async () => {
    const res = await req(app).post("/quests").send(questFixtures.invalid.rewardXpString);

    assert.equal(res.status, 400);
});