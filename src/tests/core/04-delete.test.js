import test, {before, afterEach} from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
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

test("DELETE /quests/1 204 - body is empty", async () => {
    const res = await req(app).delete(`/quests/1`);

    assert.equal(res.status, 204);
    assert.ok(!res.body || Object.entries(res.body).length === 0);
});