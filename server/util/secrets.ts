import dotenv from "dotenv";

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

if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

let url: string;
if (parseInt(process.env["PORT"]) === 80) {
    url = process.env.ORIGIN_URI;
} else {
    url = `${process.env.ORIGIN_URI}:${process.env.PORT}`;
}
export const APP_URL = url;