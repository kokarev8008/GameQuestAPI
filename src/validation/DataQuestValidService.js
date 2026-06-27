import { MessageValidModel } from "./models/MessageValidModel.js";
import { TitleValidModel } from "./models/TittleValidModel.js";
import { DifficultyValidModel } from "./models/DifficultyValidModel.js";
import { RewardXpValidModel } from "./models/RewardXpValidModel.js";
import { IdValidModel } from "./models/IdValidModel.js";
import { CompletedValidModel } from "./models/CompletedValidModel.js";
import { BaseValidModel } from "./models/BaseValidModel.js";

class DataQuestValidService {
    constructor() {
        this._bodyWhiteList = ["title", "difficulty", "rewardXp"];
        this._validDifficulty = ["easy", "medium", "hard"];
    }

    async patchInspector(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(400).send({message: "The body cannot be empty"});

        for (const key in req.body) {
            if (!Object.hasOwn(req.body, key)) continue;
            if (this._bodyWhiteList.includes(key) || key === "completed") continue;

            return res.status(400).send({message: `Unknow field: ${key} - in the body`});
        }

        const resultNonValidElementsArr = await this.validationElementsAndGetNonValidableElementsArr([
            req.body.title !== undefined ? new TitleValidModel(req.body.title) : undefined,
            req.body.difficulty !== undefined ? new DifficultyValidModel(req.body.difficulty) : undefined,
            req.body.rewardXp !== undefined ? new RewardXpValidModel(req.body.rewardXp) : undefined,
            req.body.completed !== undefined ? new CompletedValidModel(req.body.completed) : undefined,
        ]);

        if (resultNonValidElementsArr.length !== 0) 
            return res.status(400).send(resultNonValidElementsArr.map((val) => ({message: val.message, details: val.details})));

        next();
    }

    async postInspector(req, res, next) {
        const bodyKeyArr = Object.keys(req.body);
        const unknowElementsArr = bodyKeyArr.filter((val) => !this._bodyWhiteList.includes(val));

        if (unknowElementsArr.length !== 0) 
            return res.status(400).send({message: `Unknow field: ${unknowElementsArr} - in the body`});

        const whiteElementsInBodyArr = bodyKeyArr.filter((val) => this._bodyWhiteList.includes(val));

        if (whiteElementsInBodyArr.length !== this._bodyWhiteList.length) {
            for (const whiteElementFromList of this._bodyWhiteList) {
                if (whiteElementsInBodyArr.includes(whiteElementFromList)) continue;

                return res.status(400).send({message: `Absent ${whiteElementFromList} in the body`});
            }
        }

        const resultNonValidElementsArr = await this.validationElementsAndGetNonValidableElementsArr([
            new TitleValidModel(req.body.title), 
            new DifficultyValidModel(req.body.difficulty), 
            new RewardXpValidModel(req.body.rewardXp)]);
        
        if (resultNonValidElementsArr.length !== 0) 
            return res.status(400).send(resultNonValidElementsArr.map((val) => ({message: val.message, details: val.details})));

        next();
    }

    async validationElementsAndGetNonValidableElementsArr(validModelsArr) {
        const nonValidElementsArr = [];
        
        for (const element of validModelsArr) {
            if (element instanceof BaseValidModel) {
                const resultValid = element.isValid();
                
                if (resultValid instanceof MessageValidModel) {
                    if (resultValid.valid) continue;

                    nonValidElementsArr.push(resultValid);                
                }
            }
        }

        return nonValidElementsArr;
    }
    
    async idValidMiddleware(req, res, next) {
        const idValidModel = new IdValidModel(parseInt(req.body.id))
        const resultValid = idValidModel.isValid();

        if (!resultValid.valid)
            return res.status(400).send({errMessage: resultValid.message, details: resultValid.details});

        next();
    }
}

export default new DataQuestValidService();