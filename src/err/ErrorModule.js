export class ErrorModule extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
    
    errCodesText = {
        validErrorText: "VALIDATION_ERROR",
        invalidQuestIdText: "INVALID_QUEST_ID",
        questNotFoundText: "QUEST_NOT_FOUND",
        routeNotFoundText: "ROUTE_NOT_FOUND",
        internalErrorText: "INTERNAL_ERROR",
    }

    getErrorContract(code, message = this.message, details = this.details) {
        return { error: {
            code: code,
            message: message,
            details: details,
        }}; 
    }

    static errorHandlerMidlleware(error, req, res, next) {
        if (error instanceof ErrorModule) {
            if (error.status === 400) {
                if (error.details.id !== undefined) {
                    return res.status(400).send(error.getErrorContract(error.errCodesText.invalidQuestIdText));
                } else {
                    return res.status(400).send(error.getErrorContract(error.errCodesText.validErrorText));
                }
            } else if (error.status === 404 && error.details.id !== undefined) {
                return res.status(404).send(error.getErrorContract(error.errCodesText.questNotFoundText));
            } else if (error.status === 500) {
                console.error(error.stack);
                return res.status(500).send(error.getErrorContract(error.errCodesText.internalErrorText));
            }
        }

        return next(error);
    }

    static errorRouteNotFoundMiddleware(req, res, next) {
        const err = new ErrorModule(404, "Route is not found", { route: req.path });

        return res.status(404).json(err.getErrorContract(err.errCodesText.routeNotFoundText)); 
    }
}
