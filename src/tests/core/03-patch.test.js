import test, { before, afterEach, } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import { patchQuestFixtures } from "../fixtures/patch/patchStorage.js";
import path from "node:path";
import fs from "node:fs";
import { log } from "node:console";

process.env.DATA_FILE_PATH = path.join(process.cwd(), "src", "tests", "tmp", "readyBody-quests.json");
const readyBodyDataQuestJson = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");

const { default: app } = await import("../../app.js");

before(() => {
    if (fs.statSync(process.env.DATA_FILE_PATH).size <= 0) {
        fs.writeFileSync(process.env.DATA_FILE_PATH, readyBodyDataQuestJson);
    }
});

afterEach(() => {
    fs.writeFileSync(process.env.DATA_FILE_PATH, readyBodyDataQuestJson);
});

test("PATCH /quests/1 200 - valid", async () => {
    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.valid.allValid);   
    
    assert.equal(resPatch.status, 200);
    assert.notDeepEqual(resPatch.body, JSON.parse(readyBodyDataQuestJson)[0]);
});

test("PATCH /quests/1 200 + description cleared", async () => {
    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.valid.decriptionCleared);

    assert.equal(resPatch.status, 200);

    assert.equal(resPatch.body.description, "");

    assert.notDeepEqual(resPatch.body, JSON.parse(readyBodyDataQuestJson)[0]);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - id/createdAt/unknownField", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.idCreatedAtUnknownField);
    
    assert.equal(resPatch.status, 400);
    
    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(Object.hasOwn(resPatch.body.error.details, "id"));
    assert.ok(Object.hasOwn(resPatch.body.error.details, "createdAt"));
    assert.ok(Object.hasOwn(resPatch.body.error.details, "unknownField"));

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");

    assert.deepEqual(initialBodyQuestData, bodyQuest);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - empty body", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.emptyBody);

    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    assert.equal(resPatch.body.error.details, "null");

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - title type", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.titleType);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(Object.hasOwn(resPatch.body.error.details, "title"));

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);

});

test("PATCH /quests/1 400 + VALIDATION_ERROR - title Length > 80", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    let bodyQuest = fs.readFileSync(process.env.DATA_FILE_PATH, "utf8");
    assert.deepEqual(initialBodyQuestData, bodyQuest);

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.titleLength80);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(resPatch.body.error.details.field);
    assert.ok(resPatch.body.error.details.field === "title");

    assert.ok(resPatch.body.error.details.max);
    assert.ok(resPatch.body.error.details.max === 80);
    assert.ok(resPatch.body.error.details.data.length > 80);

    bodyQuest = fs.readFileSync(process.env.DATA_FILE_PATH, "utf8");
    assert.deepEqual(initialBodyQuestData, bodyQuest);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - rewardXp is string", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.rewardXpIsStr);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(Object.hasOwn(resPatch.body.error.details, "rewardXp")); 

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);

});

test("PATCH /quests/1 400 + VALIDATION_ERROR - description length > 300", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.decriptionLengthAlot);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(resPatch.body.error.details.field === "description"); 

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - descriptionType", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.decriptionType);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(Object.hasOwn(resPatch.body.error.details, "description"));

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - completed is string", async () => {
    const initialBodyQuestData = readyBodyDataQuestJson;

    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.completedType);
    
    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);

    assert.ok(Object.hasOwn(resPatch.body.error.details, "completed"));

    const bodyQuest = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"), "utf8");
    
    assert.deepEqual(initialBodyQuestData, bodyQuest);
});