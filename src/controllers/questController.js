import path from "path";
import fs from "fs/promises";
import Quest from "./models/Quest.js";
import { DataBodyQuestValidService } from "../validation/body/DataBodyQuestValidService.js";
import baseValidService from "../validation/models/BaseValidService.js";
import { ErrorModule } from "../err/ErrorModule.js";

const dataPath = path.join("src", "data.json");

class QuestController {
    async getQuests(req, res, next) {
        const dataArr = await this._getAllData(next);
        
        if (req.query.difficulty !== undefined) {
            const resultValidDifficulty = baseValidService.isValueFromWhiteList(req.query.difficulty, "difficluty", DataBodyQuestValidService.difficultyLevelList);

            if (resultValidDifficulty instanceof ErrorModule) {
                return next(new ErrorModule(400, resultValidDifficulty.message, { difficulty: resultValidDifficulty.details }));
            } else {
                const filtredDataArr = dataArr.filter((item) => item.difficulty === req.query.difficulty);
        
                return res.status(200).send(filtredDataArr); 
            }

        } else {
            return res.status(200).send(dataArr);
        }

        return next();
    }

    async getQuestById(req, res, next) {  
        const data = await this._getDataByID(req.params.id, next);
        
        if (data === undefined) {
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));
        } else {
            return res.status(200).send(data);
        }

        return next();
    }

    async createQuest(req, res, next) {
        const dataArr = await this._getAllData(next);

        const idArr = dataArr.length === 0 ? [0] : dataArr.map((item) => item.id);           
 
        const newId = idArr.reduce((prev, curr) => {
            if (curr > prev) return curr;
            else return prev;
        }) + 1;

        const newQuest = new Quest(newId, req.body.title, req.body.difficulty, req.body.rewardXp);
        await this._savePushDataArr(newQuest, next);

        return res.status(201).send(newQuest);
    }

    async patchQuestById(req, res, next) {
        const dataById = await this._getDataByID(req.params.id, next);
        
        if (dataById === undefined) {
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));
        }

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

        const allDataArr = await this._getAllData(next);

        allDataArr[allDataArr.findIndex((item) => item.id === Number(req.params.id))] = dataById;

        await this._rewriteData(allDataArr, next);

        return res.status(200).send({message: "The quest has been update"});
    }

    async deleteQuestById(req, res, next) {
        const dataArr = await this._getAllData(next);
        const data = await this._getDataByID(req.params.id, next)
        
        if (data === undefined) {
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));
        }

        const newDataArr = dataArr.filter((item) => item.id !== data.id)
        await this._rewriteData(newDataArr, next);

        return res.status(204).send();
    }

    async _getAllData(next) {
        const data = await fs.readFile(dataPath, "utf8")
            .catch((err) => next(new ErrorModule(500, "Error Path", { path: err.path })));

        const dataArr = JSON.parse(data);
        
        return dataArr;
    }

    async _getDataByID(id, next) {
        const dataArr = await this._getAllData(next);
        const data = dataArr.find((item) => item["id"] === Number(id));

        return data; 
    }

    async _savePushDataArr(data, next) {
        const dataArr = await this._getAllData(next);
        dataArr.push(data);

        const jsonData = JSON.stringify(dataArr, null, 2);
        await fs.writeFile(dataPath, jsonData)
            .catch((err) => next(new ErrorModule(500, "Error Path", { path: err.path })));
    }

    async _rewriteData(dataArr, next) {
        const jsonData = JSON.stringify(dataArr, null, 2);
        await fs.writeFile(dataPath, jsonData)
            .catch((err) => next(new ErrorModule(500, "Error Path", { path: err.path })));
    }
}

export default new QuestController();