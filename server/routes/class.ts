import express, { Router } from "express";
import passport from "passport";
import { check, query } from "express-validator";
import * as controllers from "../controllers/class";

/*
 * / view all classes, GET
 * /add class, POST
 * /remove/:id remove class with given id, GET
 * /edit edit and update class, POST
 */

const classroom: Router = express.Router();

classroom.route("/edit").post(
    controllers.edit
);
classroom.route("/add").post(
    controllers.add
);
classroom.route("/").get(
    controllers.view
);
classroom.route("/remove/:id").get(
    controllers.remove
);

export default classroom;