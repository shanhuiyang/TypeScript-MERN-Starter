import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE, INVALID_TOKEN_ERROR } from "./constants";
import sleep from "./sleep";
import { getStorage as localStorage } from "../shared/storage";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export type Method = "GET" | "POST" | "PUT";

const TEST_FOR_LOADING: boolean = false;

let hostUrl: string;

// Must call setHostUrl for each client at their start up
export const setHostUrl = (host: string): void => {
    hostUrl = host;
};

export const getHostUrl = (): string => {
    return hostUrl;
};

const _fetch = async (url: string, body: any, method: Method, withToken?: boolean, onProgress?: (progressEvent: ProgressEvent) => void): Promise<any> => {
    if (TEST_FOR_LOADING) {
        await sleep(2000);
    }
    let completeUrl: string = url;
    if (url && !url.startsWith(getHostUrl())) {
        completeUrl = `${getHostUrl()}${url}`;
    }
    const headers: any = {
        Accept: "*/*", // For Android client this header line is must-have otherwise the server won't respond as expected
        // Origin: (window && window.location /* is website */) ? window.location.origin : getHostUrl()
    };
    if (withToken) {
        const token: string | null = await localStorage().getItem(ACCESS_TOKEN_KEY);
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        } else {
            return Promise.reject(INVALID_TOKEN_ERROR);
        }
    }
    const options: AxiosRequestConfig = {
        url: completeUrl,
        method: method,
        headers: headers,
        withCredentials: true
    };
    if (method === "POST") {
        headers["Content-Type"] = "application/json";
        options.data = body;
    } else if (method === "PUT") {
        headers["Content-Type"] = (body as File).type;
        options.data = body;
        options.onUploadProgress = onProgress;
    }

    return axios(options).then((response: AxiosResponse): Promise<any> => {
        let contentType: string | null = response.headers["Content-Type"] || response.headers["content-type"];
        if (response.status >= 200 && response.status < 300) {
            contentType = contentType && contentType.toLowerCase();
            if (contentType && contentType.startsWith(RESPONSE_CONTENT_TYPE.HTML) && response.request.responseURL) {
                // Drop the html because we use client routing instead of server routing
                let targetTo: string = response.request.responseURL;
                if (targetTo.startsWith(getHostUrl())) {
                    targetTo = targetTo.substring(getHostUrl().length);
                }
                return Promise.resolve({ redirected: false, to: targetTo });
            }
            else {
                return Promise.resolve(response.data);
            }
        } else {
            return Promise.reject({
                isAxiosError: true,
                config: response.config,
                response: response
            } as AxiosError);
        }
    }).catch((error: AxiosError): Promise<any> => {
        const response: AxiosResponse | undefined = error.response;
        if (!response) {
            return Promise.reject({name: "Unknown error!"});
        }
        let contentType: string | null = response.headers["Content-Type"] || response.headers["content-type"];
        contentType = contentType && contentType.toLowerCase();
        if (contentType && contentType.toLowerCase().startsWith(RESPONSE_CONTENT_TYPE.HTML)) {
            return Promise.reject(({
                name: `${response.status} ${response.statusText}`,
                message: "",
                stack: response.data
            } as Error));
        } else {
            return Promise.reject(({
                name: `${response.status} ${response.statusText}`,
                message: response.data.message
            } as Error));
        }
    });
};

export default _fetch;