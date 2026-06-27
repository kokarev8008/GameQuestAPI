import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class IdValidModel extends BaseValidModel {
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid id", "id is undefined");
        
        if (typeof this.val !== "number") 
            return new MessageValidModel(false, "invalid id", "id is not a number");
        else if (!Number.isInteger(id)) 
            return new MessageValidModel(false, "invalid id", "id is not a integer");        
                
        if (this.val > 0)
            return new MessageValidModel(true, "correct", "correct");
        else 
            return new MessageValidModel(false, "invalid id", "id is negative number");                      
    }
}