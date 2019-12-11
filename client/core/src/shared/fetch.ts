import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE, INVALID_TOKEN_ERROR } from "./constants";
import sleep from "./sleep";
import { getStorage as localStorage } from "../shared/storage";

if (typeof document !== "undefined" && !!(document as any).documentMode) {
    console.log("This is IE detected.");
}

export type Method = "GET" | "POST" | "PUT";

const TEST_FOR_LOADING: boolean = false;

let HOST_URL: string = "http://localhost:3000";

export const setHostUrl = (host: string): void => {
    HOST_URL = host;
};

export const getHostUrl = (): string => {
    return HOST_URL;
};

const _fetch = async (url: string, body: any, method: Method, withToken?: boolean): Promise<any> => {
    if (TEST_FOR_LOADING) {
        await sleep(2000);
    }
    let completeUrl: string = url;
    if (url && !url.startsWith(getHostUrl())) {
        completeUrl = `${getHostUrl()}${url}`;
    }
    const headers: any = {
        Accept: "*/*" // For Android client this header line is must-have otherwise the server won't respond expectively
    };
    if (withToken) {
        const token: string | null = await localStorage().getItem(ACCESS_TOKEN_KEY);
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        } else {
            return Promise.reject(INVALID_TOKEN_ERROR);
        }
    }
    const options: any = {
        method: method,
        headers: headers,
        credentials: "include"
    };
    if (method === "POST") {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    } else if (method === "PUT") {
        headers["Content-Type"] = (body as File).type;
        options.body = body;
    }
    const response: Response = await fetch(completeUrl, options);
    let contentType: string | null = response.headers.get("Content-Type") || response.headers.get("content-type");
    if (response.ok) {
        if (contentType === null) {
            return response.text();
        }
        contentType = contentType.toLowerCase();
        if (contentType.startsWith(RESPONSE_CONTENT_TYPE.TEXT)) {
            return response.text();
        }
        else if (contentType.startsWith(RESPONSE_CONTENT_TYPE.JSON)) {
            return response.json();
        }
        else if (contentType.startsWith(RESPONSE_CONTENT_TYPE.HTML) && response.url) {
            // Drop the html because we use client routing instead of server routing
            let targetTo: string = response.url;
            if (targetTo.startsWith(getHostUrl())) {
                targetTo = targetTo.substring(getHostUrl().length);
            }
            return Promise.resolve({ redirected: false, to: targetTo });
        }
        else {
            return response.text();
        }
    }
    else {
        if (contentType && contentType.toLowerCase().startsWith(RESPONSE_CONTENT_TYPE.JSON)) {
            return response.json().then((body: any) => {
                return Promise.reject(({
                    name: `${response.status} ${response.statusText}`,
                    message: body && body.message
                } as Error));
            });
        }
        else if (contentType && contentType.toLowerCase().startsWith(RESPONSE_CONTENT_TYPE.TEXT)) {
            return response.text().then((textBody: any) => {
                return Promise.reject(({
                    name: `${response.status} ${response.statusText}`,
                    message: textBody
                } as Error));
            });
        }
        else if (contentType && contentType.toLowerCase().startsWith(RESPONSE_CONTENT_TYPE.HTML)) {
            return response.text().then((htmlBody: any) => {
                return Promise.reject(({
                    name: `${response.status} ${response.statusText}`,
                    message: "",
                    stack: htmlBody
                } as Error));
            });
        }
        else {
            return Promise.reject(({
                name: `${response.status} ${response.statusText}`,
                message: ""
            } as Error));
        }
    }
};

export default _fetch;