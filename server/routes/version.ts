import express, { Router } from "express";
import * as controllers from "../controllers/version";

const version: Router = express.Router();

version.route("/").get(controllers.get);

export default version;