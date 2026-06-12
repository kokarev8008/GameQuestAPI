import path from "path";
import fs from "fs/promises";
import Quest from "./Quest.js";

const dataPath = path.join("src", "data.json");

class QuestController {
    async getQuests(req, res) {
        const dataArr = await this._getAllData();

        if (req.query.difficulty !== undefined) {
            const filtredDataArr = dataArr.filter((item) => item.difficulty === req.query.difficulty);
            res.status(200).send(filtredDataArr); 
        } else {
            res.status(200).send(dataArr);
        }
    }

    async getQuestById(req, res) {
        const data = await this._getDataByID(req.params.id);
        
        if (data === undefined)
            res.status(404).send({message: "A quest with this ID was not found"});
        else
            res.status(200).send(data);
    }

    async createQuest(req, res) {
        const validArr = this._dataValidation(req.body.title, req.body.difficulty, req.body.rewardXp, req.body.completed);

        if (validArr.every((item) => item === true)) {
            const dataArr = await this._getAllData();

            const idArr = dataArr.length === 0 ? [0] : dataArr.map((item) => item.id);           
 
            const newId = idArr.reduce((prev, curr) => {
                if (curr > prev) return curr;
                else return prev;
            }) + 1;

            const newQuest = new Quest(newId, req.body.title, req.body.difficulty, req.body.rewardXp, req.body.completed);
            this._savePushDataArr(newQuest);

            res.status(201).send(newQuest);
        } else {
            res.status(400).send(validArr.filter((item) => item.valid === false)
                .map((item) => { return { errMessage: item.message }}));
        }

    }

    async patchQuestById(req, res) {
        const data = await this._getDataByID(req.params.id);
        
        if (data === undefined) {
            res.status(404).send({message: "A quest with this ID was not found"});
            return;
        }

        const clientDataArr = {};

        for (const key in data) {
            if (!Object.hasOwn(data, key)) continue;
            
            const element = data[key];
            
            clientDataArr[key] = req.body[key] === undefined ? element : req.body[key];
        }

        const validArr = this._dataValidation(clientDataArr["title"], 
            clientDataArr["difficulty"],
            clientDataArr["rewardXp"], 
            clientDataArr["completed"]);

        if (validArr.every((item) => item === true)) {
            const dataArr = await this._getAllData();
            
            for (const key in data) {
                if (!Object.hasOwn(data, key)) continue;

                const element = data[key];

                data[key] = clientDataArr[key] !== element && clientDataArr[key] !== undefined ? clientDataArr[key] : element;
            } 

            dataArr[dataArr.findIndex((item) => item.id === parseInt(req.params.id))] = data;

            await this._rewriteData(dataArr);

            res.status(200).send({message: "The quest has been update"});
        } else {
            res.status(400).send(validArr
                .filter((item) => item.valid === false)
                .map((item) => { return { errMessage: item.message }}));
        }

    }

    async deleteQuestById(req, res) {
        const dataArr = await this._getAllData();
        const data = await this._getDataByID(req.params.id)
        
        if (data === undefined) {
            res.status(404).send({message: "A quest with this ID was not found"});
            return;
        }

        const newDataArr = dataArr.filter((item) => item.id !== data.id)
        await this._rewriteData(newDataArr);

        res.status(204).send({message: "successfully"});
    }

    async _getAllData() {
        const data = await fs.readFile(dataPath, "utf8");
        const dataArr = JSON.parse(data);
        
        return dataArr;
    }

    async _getDataByID(id) {
        const dataArr = await this._getAllData();
        const data = dataArr.find((item) => item["id"] === parseInt(id));

        return data; 
    }

    async _savePushDataArr(data) {
        const dataArr = await this._getAllData();
        dataArr.push(data);

        const jsonData = JSON.stringify(dataArr, null, 2);
        await fs.writeFile(dataPath, jsonData);
    }

    async _rewriteData(dataArr) {
        const jsonData = JSON.stringify(dataArr, null, 2);
        await fs.writeFile(dataPath, jsonData);
    }

    _dataValidation(title, difficulty, rewardXp, completed = false) {
        const validDifficulty = ["easy", "medium", "hard"];

        const validArr = [];

        validArr.push(typeof title === "string" && title !== undefined ? true : {valid: false, message: "invalid title"});
        validArr.push(validDifficulty.some((val) => val === difficulty) ? true : {valid: false, message: "invalid difficulty"});
        validArr.push(typeof rewardXp === "number" && rewardXp >= 0 ? true : {valid: false, message: "invalid rewardXp"});
        validArr.push(typeof completed === "boolean" ? true : {valid: false, message: "invalid completed"});
        
        return validArr;
    }
}

export default new QuestController();