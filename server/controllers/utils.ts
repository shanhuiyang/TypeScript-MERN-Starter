import { ValidationError, Result } from "express-validator";
import { Response } from "express";

export const validationErrorResponse = (res: Response,
                                        errors: Result<ValidationError>
                                        ): Response | false => {
    if (!errors.isEmpty()) {
        const error: any /*ValidationError*/ = errors.array()[0];
        const message: string = `${error.msg} of ${error.param}: ${error.value}`;
        return res
            .status(400)
            .json({message: message});
    } else {
        return false;
    }
};