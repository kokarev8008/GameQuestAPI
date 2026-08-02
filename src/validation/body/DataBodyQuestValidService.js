import baseValidService from "../models/BaseValidService.js";
import { ErrorModule } from "../../err/ErrorModule.js";

export class DataBodyQuestValidService {
    static difficultyLevelList = ["easy", "medium", "hard"];
    _bodyWhiteList = ["title", "difficulty", "rewardXp", "description"];

    patchInspector(req, res, next) { 
        const bodyKeysArr = Object.keys(req.body);

        if (bodyKeysArr.length === 0) 
            return next(new ErrorModule(400, "The body cannot be empty", "null"));

        const unknowKeysArr = bodyKeysArr.filter((val) => val !== "completed" && !this._bodyWhiteList.includes(val));

        if (unknowKeysArr.length !== 0) 
            return next(new ErrorModule(400, "Unknown field in the body",
                Object.fromEntries(Object.entries(req.body).filter(([key]) => unknowKeysArr.includes(key)))));

        const errorModulesArr = this.validationAndGetErrorModulesArr(
        [
            req.body.title !== undefined ? baseValidService.isTextValue(req.body.title, "title", 3, 80) : undefined,
            req.body.difficulty !== undefined ? baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", 
                DataBodyQuestValidService.difficultyLevelList) : undefined,
            req.body.rewardXp !== undefined ? baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp") : undefined,
            req.body.completed !== undefined ? baseValidService.isBolleanValue(req.body.completed, "completed") : undefined,
            req.body.description !== undefined ? baseValidService.isTextValue(req.body.description, "description", 0, 300) : undefined,
        ]);

        if (errorModulesArr.length !== 0) 
            return next(new ErrorModule(400, 
                errorModulesArr.map((val) => val.message), 
                Object.fromEntries(Object.entries(errorModulesArr.map((val) => val.details)).map(([key, val]) => Object.entries(val)).flat())));

        return next();
    }

    postInspector(req, res, next) {
        const bodyKeysArr = Object.keys(req.body);
        const unknownKeysArr = bodyKeysArr.filter((val) => !this._bodyWhiteList.includes(val));

        if (unknownKeysArr.length !== 0) 
            return next(new ErrorModule(400, "Unknown field in the body",
                Object.fromEntries(Object.entries(req.body).filter(([key]) => unknownKeysArr.includes(key)))));
        
        const whiteKeysInBodyArr = bodyKeysArr.filter((val) => this._bodyWhiteList.includes(val));

        if ((!whiteKeysInBodyArr.includes("description") ? whiteKeysInBodyArr.length + 1 : whiteKeysInBodyArr.length) !== this._bodyWhiteList.length) {
            const absentWhiteKeysArr = this._bodyWhiteList.filter((val) => val !== "description" ? !whiteKeysInBodyArr.includes(val) : false);

            return next(new ErrorModule(400, `Absent ${absentWhiteKeysArr} in the body`, 
                Object.fromEntries(absentWhiteKeysArr.map((val) => [val, val]))));
        }

        const errorModulesArr = this.validationAndGetErrorModulesArr(
        [
            baseValidService.isTextValue(req.body.title, "title", 3, 100), 
            baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", 
                DataBodyQuestValidService.difficultyLevelList), 
            baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp"),
            req.body.description !== undefined ? baseValidService.isTextValue(req.body.description, "description", 0, 300) : "",
        ]);        

        if (errorModulesArr.length !== 0) 
            return next(new ErrorModule(400, 
                errorModulesArr.map((val) => val.message), 
                Object.fromEntries(Object.entries(errorModulesArr.map((val) => val.details)).map(([key, val]) => Object.entries(val)).flat())));

        return next();
    }

    validationAndGetErrorModulesArr(baseValidArr) {
        return baseValidArr.filter((val) => val instanceof ErrorModule);
    }
    
    idValidMiddleware(req, res, next) {       
        const resultValid = baseValidService.isPositiveNumber(Number(req.params.id), "id");
        
        if (resultValid instanceof ErrorModule) {
            resultValid.details = {
                id: resultValid.details
            }

            return next(resultValid);
        }

        return next();
    }
}

export default new DataBodyQuestValidService();