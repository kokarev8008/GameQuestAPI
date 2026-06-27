import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class IdValidModel extends BaseValidModel {
    isValid() {
        this.val = Number(this.val);

        if (this.val === undefined)
            return new MessageValidModel(false, "invalid id", "id is undefined");

        if (!Number.isFinite(this.val))
            return new MessageValidModel(false, "invalid id", "id is NaN");    
        else if (!Number.isInteger(this.val)) 
            return new MessageValidModel(false, "invalid id", "id is not a integer");        
                
        if (this.val > 0)
            return new MessageValidModel(true, "correct", "correct");
        else 
            return new MessageValidModel(false, "invalid id", "id is negative number");                      
    }
}