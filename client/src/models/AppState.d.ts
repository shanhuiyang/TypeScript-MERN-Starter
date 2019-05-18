import User from "./User";
export default interface AppState {
    user: User | undefined; // If user is undefined then user has not logged in.
}