import { ACCESS_TOKEN_KEY, RESPONSE_CONTENT_TYPE } from "../constants";

export type Method = "GET" | "POST";

const _fetch = (url: string, body: any, method: Method, withToken?: boolean): Promise<any> => {
    const headers: any = {
        "Content-Type": "application/json"
    };
    if (withToken) {
        headers["Authorization"] = "Bearer " + localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    const options: any = {
        method: method,
        headers: headers,
    };
    if (method === "POST") {
        options.body = JSON.stringify(body);
    }
    return fetch(`${window.location.origin}${url}`, options)
    .then((response: Response) => {
        if (response.ok) {
            let contentType: string | null = response.headers.get("Content-Type") || response.headers.get("content-type");
            if (contentType === null) {
                return response.text();
            }
            contentType = contentType.toLowerCase();
            if (contentType.startsWith(RESPONSE_CONTENT_TYPE.TEXT)) {
                return response.text();
            } else if (contentType.startsWith(RESPONSE_CONTENT_TYPE.JSON)) {
                return response.json();
            } else if (contentType.startsWith(RESPONSE_CONTENT_TYPE.HTML)) {
                // Drop the html payload and redirect to the url from client
                window.location.href = response.url;
                return Promise.resolve({ redirected: true, to: response.url });
            } else {
                return response.text();
            }
        } else {
            return response.json().then((body: any) => {
                return Promise.reject({
                    name: `${response.status} ${response.statusText}`,
                    message: body && body.message
                } as Error);
            });
        }
    });
};

export default _fetch;