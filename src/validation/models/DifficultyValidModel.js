import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class DifficultyValidModel extends BaseValidModel {
    _validDifficulty = ["easy", "medium", "hard"];
    
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid difficulty", `${this.val} is undefined`);

        if (typeof this.val !== "string") 
            return new MessageValidModel(false, "invalid difficulty", `${this.val} is not a string`);
        else if (this._validDifficulty.some((val) => val === this.val)) 
            return new MessageValidModel(true, "correct", "ok");
        else 
            return new MessageValidModel(false, "invalid difficulty", `${this.val} - incorrect difficulty level`);
                            
    }
}