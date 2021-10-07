import express, { Router } from "express";
import { check, query } from "express-validator";
import passport from "passport";
import * as controllers from "../controllers/student";

const student: Router = express.Router();

student.route("/add").post();
student.route("/update").post();
student.route("/view").get(
    controllers.view
);

export default student;