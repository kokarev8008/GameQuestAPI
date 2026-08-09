import questRepository from "../repositories/questRepository.js";

class QuestStatsController {
    async getQuests(req, res) {
        const result = await questRepository.getAllQuests();

        res.status(200).send(result);
    }

    async getQuestById(req, res) {
        const result = await questRepository.getQuestById(req.params.id);
        
        res.status(200).send(result);
    }
}

export default new QuestStatsController();