import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class CompletedValidModel extends BaseValidModel {
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid completed", `${this.val} is undefined`);
        
        if (typeof this.val !== "boolean") 
            return new MessageValidModel(false, "invalid completed", `${this.val} is not a boolean`);
        else
            return new MessageValidModel(true, "correct", "ok");
    }
}
