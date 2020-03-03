// This file is intended to remove the repetition of url & port settings across server and clients.
// Do not use .env file to store the domain and port since it's difficult to share across platforms.

// You should use explicit ip address such as http://172.21.55.1 instead of http://localhost here if you would like to debug/test the app in LAN for mobile devices.
// Android emulator also cannot fetch http://localhost correctly. see https://github.com/facebook/react-native/issues/10404 for the detail of this issue.
export const HOST_NAME_DEV: string = "http://localhost";
export const HOST_NAME_ANDROID_LOCAL: string = "http://10.0.2.2"; // for Android emulator debug only
export const HOST_PORT_DEV: number = 3000;
// If you would like to change SERVER_PORT_DEV, please modify client/core/src/setupProxy.js accordingly.
export const SERVER_PORT_DEV: number = 3001;
export const HOST_URL_DEV: string = `${HOST_NAME_DEV}:${HOST_PORT_DEV}`;
export const HOST_NAME_PROD: string = "https://<your_app_name>.azurewebsites.net";

// Keep HOST_PORT_PROD and SERVER_PORT_PROD **the same** for production environment
export const HOST_PORT_PROD: number = 80;
export const SERVER_PORT_PROD: number = HOST_PORT_PROD;

let url: string;
if (HOST_PORT_PROD === 80) {
    url = HOST_NAME_PROD;
} else {
    url = `${HOST_NAME_PROD}:${HOST_PORT_PROD}`;
}
export const HOST_URL_PROD = url;
export const CORS_WHITELIST: string [] = [
    // Add the origins you would like to whitelist
    `${HOST_NAME_ANDROID_LOCAL}:${HOST_PORT_DEV}`,
    HOST_URL_DEV
];
