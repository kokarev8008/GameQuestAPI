import { DataBodyQuestValidService } from "../validation/body/DataBodyQuestValidService.js";
import baseValidService from "../validation/models/BaseValidService.js";
import { ErrorModule } from "../err/ErrorModule.js";
import questRepository from "../repositories/questRepository.js";

class QuestController {
    async getQuests(req, res, next) {
        const dataArr = await questRepository.getAllQuests(); 
        
        if (dataArr === null) return next(new ErrorModule(500, "dataBase error", null));
        
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

        if (data === null) return next(new ErrorModule(500, "dataBase error", null));
        
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

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));

        return res.status(201).send(result);
    }

    async patchQuestById(req, res, next) {
        const result = await questRepository.updateQuest(req.params.id, req.body);

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(200).send(result);
    }

    async deleteQuestById(req, res, next) {
        const result = await questRepository.deleteQuest(req.params.id);

        if (result === null) return next(new ErrorModule(500, "dataBase error", null));
        else if (result === undefined) 
            return next(new ErrorModule(404, "A quest with this ID was not found", { id: req.params.id }));

        return res.status(204).send();
    }
}

export default new QuestController();