import dotenv from "dotenv";
import { HOST_URL_PROD, HOST_URL_DEV, SERVER_PORT_PROD, SERVER_PORT_DEV, HOST_NAME_PROD, HOST_NAME_DEV } from "../../client/core/src/models/HostUrl";

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";

if (prod) {
    console.log = (input: string): void => {/* Disable log in production */};
    dotenv.config({ path: ".env.production" });
} else {
    console.log("  Using .env.development file to supply config environment variables");
    dotenv.config({ path: ".env.development" });  // you can delete this after you create your own .env file!
}

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT;
export const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;

if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

let url: string;
let server_port: number;
let origin: string;
if (prod) {
    url = HOST_URL_PROD;
    server_port = SERVER_PORT_PROD;
    origin = HOST_NAME_PROD;
} else {
    url = HOST_URL_DEV;
    server_port = SERVER_PORT_DEV;
    origin = HOST_NAME_DEV;
}
export const HOST_URL = url;
export const SERVER_PORT = server_port;
export const ORIGIN_URI = origin;