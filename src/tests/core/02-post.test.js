import test, { after, afterEach, beforeEach } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { postQuestFixtures } from "../fixtures/post/postStorage.js";
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
    const res = await req(app).post("/quests").send(postQuestFixtures.valid);
    
    assert.equal(res.status, 201);
    assert.ok(Object.hasOwn(res.body, "id"));
    assert.ok(Object.hasOwn(res.body, "createdAt"));
    assert.ok(Object.hasOwn(res.body, "completed"));
});

test("POST /quests 400 + VALIDATION_ERROR - title missing", async () => {
    const res = await req(app).post("/quests").send(postQuestFixtures.invalid.titleMissing);

    assert.equal(res.status, 400);

    assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);

    //потом изменить реализацию отображения недостающих ключей
    assert.ok(res.body.error.details[0] === "title");
});

test("POST /quests 400 + VALIDATION_ERROR - rewardXp string", async () => {
    const res = await req(app).post("/quests").send(postQuestFixtures.invalid.rewardXpString);

    assert.equal(res.status, 400);

    assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
});

test("POST /quests 400 + VALIDATION_ERROR - rewardXp=0, decimal, wrong difficulty", async () => {
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

test("POST /quests 400 + VALIDATION_ERROR - completed/id/createdAt/unknownField", async () => {
    const res = await req(app).post("/quests").send(postQuestFixtures.invalid.completedIdCreatedAtUnknownField);

    assert.equal(res.status, 400);

    assert.equal(res.body.error.code, ErrorModule.errCodesText.validErrorText);
});
