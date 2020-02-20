import { Storage } from "./storage.d";
import * as AzureStorage from "./azure/blob-storage";
import * as LocalStorage from "./local/blob-storage";

let storage: Storage;
if (process.env.NODE_ENV === "production") {
    storage = AzureStorage;
} else {
    storage = LocalStorage;
}
export default storage;

export const CONTAINER_AVATAR: string = "avatar";
export const CONTAINER_ARTICLE: string = "article";
export const CONTAINER_THREAD: string = "thread";