import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class RewardXpValidModel extends BaseValidModel{
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid rewardXp", `${this.val} is undefined`);

        if (!Number.isFinite(this.val)) 
            return new MessageValidModel(false, "invalid rewardXp", `${this.val} is NaN`);
        else if (!Number.isInteger(this.val)) 
            return new MessageValidModel(false, "invalid rewardXp", `${this.val} is not a integer`);       
        
        if (this.val > 0)
            return new MessageValidModel(true, "correct", "ok");
        else 
            return new MessageValidModel(false, "invalid rewardXp", `${this.val} is negative value`);
    }
}