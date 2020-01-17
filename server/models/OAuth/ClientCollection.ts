// This is the static storage of client registration
import Client from "./Client";
import { HOST_URL } from "../../util/secrets";
const ClientCollection: Client[] = [
    {
        id: "aebb974a-3b14-4d58-8a74-72b7436deb71",
        alias: "",
        name: "Typescript MERN Starter",
        secret: "mern-is-awesome",
        hostUrl: HOST_URL,
        redirectUri: `${HOST_URL}/auth/oauth2/callback`,
    },
    // Add more client here if necessary
];
export default ClientCollection;