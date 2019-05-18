import dotenv from "dotenv";

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";

if (prod) {
    console.debug("Using .env.production file to supply config environment variables");
    dotenv.config({ path: ".env.production" });
} else {
    console.debug("Using .env.development file to supply config environment variables");
    dotenv.config({ path: ".env.development" });  // you can delete this after you create your own .env file!
}

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = /*prod ? process.env["MONGODB_URI"] : */process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
