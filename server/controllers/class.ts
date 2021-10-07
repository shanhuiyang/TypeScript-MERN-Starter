import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { validationErrorResponse } from "./utils";
import ClassCollection from "../models/Class/ClassCollection";
import ClassDocument from "../models/Class/ClassDocument";

export const view: RequestHandler = ( req: Request, res: Response, next: NextFunction  ) => {
    ClassCollection
    .find()
    .exec()
    .then((data: ClassDocument[] | null) => {
        return res.status(200).json({data});
    })
    .catch((error) => {
        return next(error);
    })
};
export const add: RequestHandler = ( req: Request, res: Response, next: NextFunction  ) => {
    const invalid: Response | false = validationErrorResponse(res,  validationResult(req));
    if(invalid) {
        return invalid;
    }
    const classroom: ClassDocument = new ClassCollection({
        label: req.body.class_label,
        studentCapacity: req.body.class_capacity
    });
    classroom
    .save()
    .then((saved: ClassDocument) => {
        res.status(200).json(saved);
    })
    .catch((error: Response) => {
        return next(error);
    })
};
export const remove: RequestHandler = ( req: Request, res: Response, next: NextFunction  ) => {
    ClassCollection
    .findById(req.params.id)
    .exec()
    .then((classroom: ClassDocument | null) => {
        return ClassCollection.findByIdAndRemove(req.params.id).exec();
    })
    .then((removed: ClassDocument | null) => {
        return res.status(200).end();
    })
    .catch((error: Response) => {
        return next(error);
    })
};
export const edit: RequestHandler = ( req: Request, res: Response, next: NextFunction  ) => {
    const invalid: Response | false = validationErrorResponse(res, validationResult(req));
    if(invalid) {
        return invalid;
    }

    ClassCollection
    .findById(req.body._id)
    .exec()
    .then((classroom: ClassDocument | null) => {
        if(!classroom) {
            return Promise.reject(res.status(404).json({message: "toast.class.not_found"}));
        }
        return ClassCollection.findByIdAndUpdate(req.body._id, { label: req.body.class_label, studentCapacity: req.body.class_capacity});
    })
    .then((updated: ClassDocument | null) => {
        if(!updated) {
            return Promise.reject(res.status(401).json({message: "toast.class.not_found"}));
        }
        return res.status(200).json(updated);
    })
    .catch((error: Response) => {
        return next(error);
    })
};