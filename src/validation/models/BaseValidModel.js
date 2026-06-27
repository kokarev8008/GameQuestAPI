export class BaseValidModel {
    constructor(val) {
        this.val = val;
    }

    isValid() {
        return false;
    }
}