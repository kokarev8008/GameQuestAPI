import test from "node:test";
import { strict as assert } from "node:assert";
import req from "supertest";
import { ErrorModule } from "../../err/ErrorModule.js";
import path from "node:path";

process.env.DATA_FILE_PATH = path.join("src", "errorPath.json");

const {default: app1} = await import("../../app.js");

test("INTERNAL_ERROR + 500 through GET /quests - errorPath", { todo: true }, async () => {
    // const res = await req(app1).get("/quests");

    // assert.equal(res.status, 500);
    // assert.equal(res.body.error.code, ErrorModule.errCodesText.internalErrorText);
    // assert.equal(res.body.error.details, null);
});

process.env.DATA_FILE_PATH = path.join(process.cwd(), "src", "tests", "fixtures", "internalError.txt");

const {default: app2} = await import("../../app.js");

test("INTERNAL_ERROR + 500 through GET /quests - SyntaxError Json", { todo: true }, async () => {
    // const res = await req(app2).get("/quests");

    // assert.equal(res.status, 500);
    // assert.equal(res.body.error.code, ErrorModule.errCodesText.internalErrorText);
    // assert.equal(res.body.error.details, null);
});