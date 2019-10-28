import { ValidationError, Result } from "express-validator";
import { Response } from "express";

export const validationErrorResponse = (res: Response,
                                        errors: Result<ValidationError>
                                        ): Response | false => {
    if (!errors.isEmpty()) {
        const error: any /*ValidationError*/ = errors.array()[0];
        return res
            .status(400)
            .json({message: error.msg});
    } else {
        return false;
    }
};