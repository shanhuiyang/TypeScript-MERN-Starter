import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE } from "./constants";
import sleep from "./sleep";

export type Method = "GET" | "POST" | "PUT";

const TEST_FOR_LOADING: boolean = false;

const _fetch = async (url: string, body: any, method: Method, withToken?: boolean): Promise<any> => {
    if (TEST_FOR_LOADING) {
        await sleep(2000);
    }
    const headers: any = {};
    if (withToken) {
        headers["Authorization"] = "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY);
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
        headers["Content-Type"] = "application/octet-stream";
        options.body = body;
    }
    const response = await fetch(`${window.location.origin}${url}`, options);
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
        else if (contentType.startsWith(RESPONSE_CONTENT_TYPE.HTML)) {
            // Drop the html payload and redirect to the url from client
            window.location.href = response.url;
            return Promise.resolve({ redirected: true, to: response.url });
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
            return response.text().then((body_1: any) => {
                return Promise.reject(({
                    name: `${response.status} ${response.statusText}`,
                    message: body_1
                } as Error));
            });
        }
        else if (contentType && contentType.toLowerCase().startsWith(RESPONSE_CONTENT_TYPE.HTML)) {
            return response.text().then((body_2: any) => {
                return Promise.reject(({
                    name: `${response.status} ${response.statusText}`,
                    message: "",
                    stack: body_2
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