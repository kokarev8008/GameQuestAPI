import { DataBodyQuestValidService } from "../validation/body/DataBodyQuestValidService.js";
import baseValidService from "../validation/models/BaseValidService.js";
import { ErrorModule } from "../err/ErrorModule.js";
import questRepository from "../repositories/questRepository.ts";
import type { Request, Response } from "express";
import Quest from "./models/Quest.js";

class QuestController {
    async getQuests(req: Request, res: Response, next: Function) {
        const dataArr = await questRepository.getAllQuests(); 
        
        if (dataArr === null) return next(new ErrorModule(500, "dataBase error", null));
        
        if (req.query.difficulty !== undefined) {
            const resultValidDifficulty = baseValidService.isValueFromWhiteList(req.query.difficulty, 
                "difficluty", DataBodyQuestValidService.difficultyLevelList);

            if (resultValidDifficulty instanceof ErrorModule) {
                return next(resultValidDifficulty);                
            } else {
                let filtredDataArr: Array<Quest>;

                if (dataArr instanceof Array){
                    filtredDataArr = dataArr.filter((item) => item.difficulty === req.query.difficulty);
                
                    return res.status(200).send(filtredDataArr); 
                }
            }

        } else {
            return res.status(200).send(dataArr);
        }
    }

    async getQuestById(req: Request, res: Response, next: Function) {  
        const data = await questRepository.getQuestById(Number(req.params.id as string));

        if (data === null) return next(new ErrorModule(500, "dataBase error", null));
        
        if (data === undefined) {
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));
        } else {
            return res.status(200).send(data);
        }
    }

    async getStatsAllQuests(req: Request, res: Response, next: Function) {
        const result = await questRepository.getStats();
            
        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
    
        return res.status(200).send(result);                 
    }

    async createQuest(req: Request, res: Response, next: Function) {
        const result = await questRepository.createQuest(req.body.title, req.body.difficulty, req.body.rewardXp, req.body.description);

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));

        return res.status(201).send(result);
    }

    async patchQuestById(req: Request, res: Response, next: Function) {
        const result = await questRepository.updateQuest(Number(req.params.id), req.body);

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(200).send(result);
    }

    async deleteQuestById(req: Request, res: Response, next: Function) {
        const result = await questRepository.deleteQuest(Number(req.params.id));

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(204).send();
    }
}

export default new QuestController();