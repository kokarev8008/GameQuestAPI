import { BaseValidModel } from "./BaseValidModel.js";
import { MessageValidModel } from "./MessageValidModel.js";

export class TitleValidModel extends BaseValidModel {
    isValid() {
        if (this.val === undefined)
            return new MessageValidModel(false, "invalid title", `${this.val} is undefined`);

        if (typeof this.val !== "string") 
            return new MessageValidModel(false, "invalid title", `${this.val} in not a string`);

        const titleTrimed = this.val.trim();

        if (titleTrimed.length < 3)
            return new MessageValidModel(false, "invalid title", `${this.val} - lenght < 3`);
        else if (titleTrimed.length > 100)
            return new MessageValidModel(false, "invalid title", `${this.val} - lenght > 100`);
        else
            return new MessageValidModel(true, "correct", "ok");
    }
}
