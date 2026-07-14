import test, { before, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import { patchQuestFixtures } from "../fixtures/patch/patchStorage.js";
import path from "node:path";
import fs from "node:fs";

process.env.DATA_FILE_PATH = path.join(process.cwd(), "src", "tests", "tmp", "readyBody-quests.json");

const {default: app} = await import("../../app.js");

before(() => {
    if (fs.statSync(process.env.DATA_FILE_PATH).size <= 0) {
        const readyBodyDataQuestJson = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"));
        fs.writeFileSync(process.env.DATA_FILE_PATH, readyBodyDataQuestJson);
    } 
});

afterEach(() => {
    const readyBodyDataQuestJson = fs.readFileSync(path.join(process.cwd(), "src", "tests", "fixtures", "readyValidBody-quests.json"));
    fs.writeFileSync(process.env.DATA_FILE_PATH, readyBodyDataQuestJson);
});

test("PATCH /quests/1 200 - valid", async () => {
    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.valid);
    
    assert.equal(resPatch.status, 200);
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - id/createdAt/unknownField", async () => {
    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.idCreatedAtUnknownField);

    assert.equal(resPatch.status, 400);
    
    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
    assert.ok(Object.hasOwn(resPatch.body.error.details, "id"));
    assert.ok(Object.hasOwn(resPatch.body.error.details, "createdAt"));
    assert.ok(Object.hasOwn(resPatch.body.error.details, "unknownField"));
});

test("PATCH /quests/1 400 + VALIDATION_ERROR - empty body", async () => {
    const resPatch = await req(app).patch("/quests/1").send(patchQuestFixtures.invalid.emptyBody);

    assert.equal(resPatch.status, 400);

    assert.equal(resPatch.body.error.code, ErrorModule.errCodesText.validErrorText);
});