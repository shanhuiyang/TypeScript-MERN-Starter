import express, { Router } from "express";
import * as controller from "../controllers/role";

const role: Router = express.Router();

role.route("/add").post(controller.add);
role.route("/").get(controller.read);

export default role;