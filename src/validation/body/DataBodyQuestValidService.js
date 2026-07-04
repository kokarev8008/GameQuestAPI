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

        const resultNonValidValuesArr = this.validationValuesAndGetNonValidableValuesArr(
        [
            req.body.title !== undefined ? baseValidService.isTextValue(req.body.title, "title", 3, 100) : undefined,
            req.body.difficulty !== undefined ? baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", 
                DataBodyQuestValidService.difficultyLevelList) : undefined,
            req.body.rewardXp !== undefined ? baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp") : undefined,
            req.body.completed !== undefined ? baseValidService.isBolleanValue(req.body.completed, "completed") : undefined,
            req.body.description !== undefined ? baseValidService.isTextValue(req.body.description, "description", 0, 300) : undefined,
        ]);

        if (resultNonValidValuesArr.length !== 0) 
            return next(new ErrorModule(400, 
                resultNonValidValuesArr.map((val) => val.message), 
                Object.fromEntries(resultNonValidValuesArr.map((val) => 
                    [this._bodyWhiteList.find((whiteVal) => val.message.split(" ").includes(whiteVal)), val.details]))));

        return next();
    }

    postInspector(req, res, next) {
        const bodyKeysArr = Object.keys(req.body);
        const unknowKeysArr = bodyKeysArr.filter((val) => !this._bodyWhiteList.includes(val));

        if (unknowKeysArr.length !== 0) 
            return next(new ErrorModule(400, "Unknown field in the body",
                Object.fromEntries(Object.entries(req.body).filter(([key]) => unknowKeysArr.includes(key)))));
        
        const whiteKeysInBodyArr = bodyKeysArr.filter((val) => this._bodyWhiteList.includes(val));

        if ((!whiteKeysInBodyArr.includes("description") ? whiteKeysInBodyArr.length + 1 : whiteKeysInBodyArr.length) !== this._bodyWhiteList.length) {
            const absentWhiteKeysArr = this._bodyWhiteList.filter((val) => val !== "description" ? !whiteKeysInBodyArr.includes(val) : false);

            return next(new ErrorModule(400, `Absent ${absentWhiteKeysArr} in the body`, { ...absentWhiteKeysArr }));
        }

        const resultNonValidValuesArr = this.validationValuesAndGetNonValidableValuesArr(
        [
            baseValidService.isTextValue(req.body.title, "title", 3, 100), 
            baseValidService.isValueFromWhiteList(req.body.difficulty, "difficulty", 
                DataBodyQuestValidService.difficultyLevelList), 
            baseValidService.isPositiveNumber(req.body.rewardXp, "rewardXp"),
            req.body.description !== undefined ? baseValidService.isTextValue(req.body.description, "description", 0, 300) : "",
        ]);
        
        if (resultNonValidValuesArr.length !== 0) 
            return next(new ErrorModule(400, 
                resultNonValidValuesArr.map((val) => val.message), 
                Object.fromEntries(resultNonValidValuesArr.map((val) => 
                    [this._bodyWhiteList.find((whiteVal) => val.message.split(" ").includes(whiteVal)), val.details]))));

        return next();
    }

    validationValuesAndGetNonValidableValuesArr(baseValidArr) {
        return baseValidArr.filter((val) => val instanceof ErrorModule);
    }
    
    idValidMiddleware(req, res, next) {       
        const resultValid = baseValidService.isPositiveNumber(req.params.id, "id");
        
        if (resultValid instanceof ErrorModule) {
            resultValid.details = {
                // Не понятно надо ли такое усложнение: время покажет
                [resultValid.message.split(" ").find((val) => val === "id")]: resultValid.details
            }

            return next(resultValid);
        }

        return next();
    }
}

export default new DataBodyQuestValidService();