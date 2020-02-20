import express, { Router } from "express";
import * as controllers from "../controllers/image";
import passport from "passport";

const image: Router = express.Router();

image.route("/upload/:container").put(
    passport.authenticate("bearer", { session: false }),
    controllers.uploadImage
);

export default image;