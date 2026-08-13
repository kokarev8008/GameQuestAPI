import { ErrorModule } from "../err/ErrorModule.js";
import questRepository from "../repositories/questRepository.js";

class QuestStatsController {
    async getStatsAllQuests(req, res, next) {
        const result = await questRepository.getStats();
        
        if (result === null) return next(new ErrorModule(500, "dataBase error", null));

        return res.status(200).send(result);                 
    }
}

export default new QuestStatsController();