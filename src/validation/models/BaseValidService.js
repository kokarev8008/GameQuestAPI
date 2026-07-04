import { ErrorModule } from "../../err/ErrorModule.js";

class BaseValidService {
    invalidText = (nameField) => `invalid ${nameField}`

    isPositiveNumber(valueForValid, nameField) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);
        
        valueForValid = Number(valueForValid);

        if (!Number.isFinite(valueForValid)) 
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is NaN`);
        else if (!Number.isInteger(valueForValid)) 
            return new ErrorModule(400, this.invalidText(nameField), `${valueForValid} is not a integer`);       
                
        if (valueForValid > 0)
            return true;
        else 
            return new ErrorModule(400, this.invalidText(nameField), `${valueForValid} is negative value`);
    }

    isBolleanValue(valueForValid, nameField) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);
        
        if (typeof valueForValid !== "boolean") 
            return new ErrorModule(400, this.invalidText(nameField), `${valueForValid} is not a boolean`);
        else
            return true;
    }

    isTextValue(valueForValid, nameField) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);

        if (typeof valueForValid !== "string") 
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} in not a string`);

        const titleTrimed = valueForValid.trim();

        if (titleTrimed.length < 3)
            return new ErrorModule(400, this.invalidText(nameField), `${titleTrimed} - lenght < 3`);
        else if (titleTrimed.length > 100)
            return new ErrorModule(400, this.invalidText(nameField), `${titleTrimed} - lenght > 100`);
        else
            return true;
    }

    isValueFromWhiteList(valueForValid, nameField, whiteListArr) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);

        if (typeof valueForValid !== "string") 
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is not a string`);
        else if (whiteListArr.some((val) => val === valueForValid)) 
            return true;
        else 
            return new ErrorModule(400, this.invalidText(nameField), `${valueForValid} - incorrect difficulty level`);
    }
}

export default new BaseValidService();