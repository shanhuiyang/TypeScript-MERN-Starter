import { ValidationError, Result } from "express-validator";
import { Response, Send } from "express";

export const validationErrorResponse = (res: Response,
                                        errors: Result<ValidationError>
                                        ): Response | false => {
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: JSON.stringify(errors.array()[0]) });
    } else {
        return false;
    }
};