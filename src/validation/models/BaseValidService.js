import { ErrorModule } from "../../err/ErrorModule.js";

class BaseValidService {
    invalidText = (nameField) => `invalid ${nameField}`

    isPositiveNumber(valueForValid, nameField) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);
        
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

    isTextValue(valueForValid, nameField, startLength, endLength) {
        if (valueForValid === undefined)
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} is undefined`);

        if (typeof valueForValid !== "string") 
            return new ErrorModule(400, this.invalidText(nameField), `${nameField} in not a string`);

        const titleTrimed = valueForValid.trim();

        if (titleTrimed.length < startLength)
            return new ErrorModule(400, this.invalidText(nameField), `${titleTrimed} - lenght < ${startLength}`);
        else if (titleTrimed.length > endLength)
            return new ErrorModule(400, this.invalidText(nameField), `${titleTrimed} - lenght > ${endLength}`);
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