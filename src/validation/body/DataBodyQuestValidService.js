import { MessageValidModel } from "../models/MessageValidModel.js";
import baseValidService from "../models/BaseValidService.js";

export class DataBodyQuestValidService {
    static difficultyLevelList = ["easy", "medium", "hard"];
    _bodyWhiteList = ["title", "difficulty", "rewardXp"];

    patchInspector(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(400).send({message: "The body cannot be empty"});

        for (const key in req.body) {
            if (!Object.hasOwn(req.body, key)) continue;
            if (this._bodyWhiteList.includes(key) || key === "completed") continue;

            return res.status(400).send({message: `Unknown field: ${key} - in the body`});
        }

        const resultNonValidElementsArr = this.validationElementsAndGetNonValidableElementsArr([
            req.body.title !== undefined ? baseValidService.isTextValue(req.body.title, "title") : undefined,
            req.body.difficulty !== undefined ? baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", DataBodyQuestValidService.difficultyLevelList) : undefined,
            req.body.rewardXp !== undefined ? baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp") : undefined,
            req.body.completed !== undefined ? baseValidService.isBolleanValue(req.body.completed, "completed") : undefined,
        ]);

        if (resultNonValidElementsArr.length !== 0) 
            return res.status(400).send(resultNonValidElementsArr.map((val) => ({message: val.message, details: val.details})));

        next();
    }

    postInspector(req, res, next) {
        const bodyKeyArr = Object.keys(req.body);
        const unknowElementsArr = bodyKeyArr.filter((val) => !this._bodyWhiteList.includes(val));

        if (unknowElementsArr.length !== 0) 
            return res.status(400).send({message: `Unknown field: ${unknowElementsArr} - in the body`});

        const whiteElementsInBodyArr = bodyKeyArr.filter((val) => this._bodyWhiteList.includes(val));

        if (whiteElementsInBodyArr.length !== this._bodyWhiteList.length) {
            const absentWhiteElementArr = [];
            for (const whiteElementFromList of this._bodyWhiteList) {
                if (whiteElementsInBodyArr.includes(whiteElementFromList)) continue;

                absentWhiteElementArr.push(whiteElementFromList);
            }

            return res.status(400).send({message: `Absent ${absentWhiteElementArr} in the body`});
        }

        const resultNonValidElementsArr = this.validationElementsAndGetNonValidableElementsArr([
            baseValidService.isTextValue(req.body.title, "title"), 
            baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", DataBodyQuestValidService.difficultyLevelList), 
            baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp")]);
        
        if (resultNonValidElementsArr.length !== 0) 
            return res.status(400).send(resultNonValidElementsArr.map((val) => ({message: val.message, details: val.details})));

        next();
    }

    validationElementsAndGetNonValidableElementsArr(messageValidModelsArr) {
        const nonValidElementsArr = [];
        
        for (const element of messageValidModelsArr) {              
            if (element instanceof MessageValidModel) {
                if (element.valid) continue;

                nonValidElementsArr.push(element);                
            }     
        }

        return nonValidElementsArr;
    }
    
    idValidMiddleware(req, res, next) {       
        const resultValid = baseValidService.isPositiveNumber(req.params.id, "id");

        if (!resultValid.valid)
            return res.status(400).send([{message: resultValid.message, details: resultValid.details}]);

        next();
    }
}

export default new DataBodyQuestValidService();