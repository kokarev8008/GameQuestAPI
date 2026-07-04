import path from "path";
import fs from "fs/promises";
import Quest from "./models/Quest.js";
import { DataBodyQuestValidService } from "../validation/body/DataBodyQuestValidService.js";
import baseValidService from "../validation/models/BaseValidService.js";
import { ErrorModule } from "../err/ErrorModule.js";

const dataPath = path.join("src", "data.json");

class QuestController {
    async getQuests(req, res) {
        const dataArr = await this._getAllData();
        
        if (req.query.difficulty !== undefined) {
            const resultValidDifficulty = baseValidService.isValueFromWhiteList(req.query.difficulty, "difficluty", DataBodyQuestValidService.difficultyLevelList);

            if (resultValidDifficulty instanceof ErrorModule) {
                res.status(400).send({message: resultValidDifficulty.message, details: resultValidDifficulty.details});
            } else {
                const filtredDataArr = dataArr.filter((item) => item.difficulty === req.query.difficulty);
        
                res.status(200).send(filtredDataArr); 
            }

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
        const dataArr = await this._getAllData();

        const idArr = dataArr.length === 0 ? [0] : dataArr.map((item) => item.id);           
 
        const newId = idArr.reduce((prev, curr) => {
            if (curr > prev) return curr;
            else return prev;
        }) + 1;

        const newQuest = new Quest(newId, req.body.title, req.body.difficulty, req.body.rewardXp);
        await this._savePushDataArr(newQuest);

        res.status(201).send(newQuest);
    }

    async patchQuestById(req, res) {
        const dataById = await this._getDataByID(req.params.id);
        
        if (dataById === undefined) 
            return res.status(404).send({message: "A quest with this ID was not found"});

        const updatedServerDataObj = {};

        for (const key in dataById) {
            if (key === "id" || key === "createdAt") continue;
            
            const serverDataByIdElement = dataById[key];
            const clientDataElement = req.body[key];

            updatedServerDataObj[key] = clientDataElement === undefined ? serverDataByIdElement : clientDataElement;
        }

        for (const key in dataById) {
            if (key === "id" || key === "createdAt") continue;
                
            const serverDataByIdElement = dataById[key];
            const updatedServerDataElement = updatedServerDataObj[key];
                
            dataById[key] = updatedServerDataElement !== serverDataByIdElement ?
            updatedServerDataElement : serverDataByIdElement; 
        } 

        const allDataArr = await this._getAllData();

        allDataArr[allDataArr.findIndex((item) => item.id === Number(req.params.id))] = dataById;

        await this._rewriteData(allDataArr);

        res.status(200).send({message: "The quest has been update"});
    }

    async deleteQuestById(req, res) {
        const dataArr = await this._getAllData();
        const data = await this._getDataByID(req.params.id)
        
        if (data === undefined) {
            return res.status(404).send({message: "A quest with this ID was not found"});
        }

        const newDataArr = dataArr.filter((item) => item.id !== data.id)
        await this._rewriteData(newDataArr);

        res.status(204).send();
    }

    async _getAllData() {
        const data = await fs.readFile(dataPath, "utf8");
        const dataArr = JSON.parse(data);
        
        return dataArr;
    }

    async _getDataByID(id) {
        const dataArr = await this._getAllData();
        const data = dataArr.find((item) => item["id"] === Number(id));

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
}

export default new QuestController();