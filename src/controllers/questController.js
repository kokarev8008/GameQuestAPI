import fs from "fs/promises";
import Quest from "./models/Quest.js";
import { DataBodyQuestValidService } from "../validation/body/DataBodyQuestValidService.js";
import baseValidService from "../validation/models/BaseValidService.js";
import { ErrorModule } from "../err/ErrorModule.js";
import questRepository from "../repositories/questRepository.js";

const dataPath = process.env.DATA_PATH;

class QuestController {
    async getQuests(req, res, next) {
        const dataArr = await questRepository.getAllQuests(); 
        
        if (dataArr === null) return;
        
        if (req.query.difficulty !== undefined) {
            const resultValidDifficulty = baseValidService.isValueFromWhiteList(req.query.difficulty, "difficluty", DataBodyQuestValidService.difficultyLevelList);

            if (resultValidDifficulty instanceof ErrorModule) {
                return next(resultValidDifficulty);
            } else {
                const filtredDataArr = dataArr.filter((item) => item.difficulty === req.query.difficulty);
        
                return res.status(200).send(filtredDataArr); 
            }

        } else {
            return res.status(200).send(dataArr);
        }
    }

    async getQuestById(req, res, next) {  
        const data = await questRepository.getQuestById(req.params.id);

        if (data === null) return;
        
        if (data === undefined) {
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));
        } else {
            return res.status(200).send(data);
        }
    }

    async getStatsAllQuests(req, res, next) {
        const result = await questRepository.getStats();
            
        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
    
        return res.status(200).send(result);                 
    }

    async createQuest(req, res, next) {
        const result = await questRepository.createQuest(req.body.title, req.body.difficulty, req.body.rewardXp, req.body.description);

        if (result === null) return;

        return res.status(201).send(result);
    }

    async patchQuestById(req, res, next) {
        const result = await questRepository.updateQuest(req.params.id, req.body);

        if (result === null) return;
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(200).send(result);
    }

    async deleteQuestById(req, res, next) {
        const result = await questRepository.deleteQuest(req.params.id);

        if (result === null) return;
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(204).send();
    }

    async _getAllData(next) {
        try {
            let data = await fs.readFile(dataPath, "utf8");
            
            data = data === "" ? "[]" : data;
            
            return JSON.parse(data);

        } catch (err) {
            next(new ErrorModule(500, "Error", null));
            return null;
        }
    }

    async _getDataByID(id, next) {
        const dataArr = await this._getAllData(next);

        if (dataArr === null) return null;

        const data = dataArr.find((item) => item["id"] === Number(id));

        return data; 
    }

    async _savePushDataArr(data, next) {
        const dataArr = await this._getAllData(next);

        if (dataArr === null) return null;

        try {
            dataArr.push(data);
    
            const jsonData = JSON.stringify(dataArr, null, 2);

            await fs.writeFile(dataPath, jsonData);

        } catch (err) {
            next(new ErrorModule(500, "Error", null));
            return null;
        }
    }

    async _rewriteData(dataArr, next) {
        try {
            const jsonData = JSON.stringify(dataArr, null, 2);
            await fs.writeFile(dataPath, jsonData);
        } catch (err) {
            next(new ErrorModule(500, "Error", null));
            return null;
        }
    }
}

export default new QuestController();