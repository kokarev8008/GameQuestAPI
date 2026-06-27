import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class TitleValidModel extends BaseValidModel {
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid title", "TODO");

        if (typeof this.val !== "string") 
            return new MessageValidModel(false, "invalid title", "TODO");

        const titleTrimed = this.val.trim();

        if (titleTrimed.length < 3)
            return new MessageValidModel(false, "invalid title", "TODO");
        else if (titleTrimed.length > 100)
            return new MessageValidModel(false, "invalid title", "TODO");
        else
            return new MessageValidModel(true, "correct", "TODO");
    }
}
