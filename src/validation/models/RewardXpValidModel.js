import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class RewardXpValidModel extends BaseValidModel{
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid rewardXp", "TODO");

        if (typeof this.val !== "number") 
            return new MessageValidModel(false, "invalid rewardXp", "TODO");
        else if (!Number.isInteger(this.val)) 
            return new MessageValidModel(false, "invalid rewardXp", "TODO");       
        
        if (this.val > 0)
            return new MessageValidModel(true, "correct", "TODO");
        else 
            return new MessageValidModel(false, "invalid rewardXp", "TODO");
    }
}