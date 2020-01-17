export default interface Client {
    id: string;
    alias: string;
    name: string;
    secret: string;
    hostUrl: string;
    redirectUri: string;
}