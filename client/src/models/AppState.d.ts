import User from "./User";
export default interface AppState {
    user: User | false; // If user is undefined then user has not logged in.
}