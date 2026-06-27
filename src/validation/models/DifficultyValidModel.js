import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class DifficultyValidModel extends BaseValidModel {
    _validDifficulty = ["easy", "medium", "hard"];
    
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid difficulty", "TODO");

        if (typeof this.val !== "string") 
            return new MessageValidModel(false, "invalid difficulty", "TODO");
        else if (this._validDifficulty.some((val) => val === this.val)) 
            return new MessageValidModel(true, "correct", "TODO");
        else 
            return new MessageValidModel(false, "invalid difficulty", "TODO");
                            
    }
}