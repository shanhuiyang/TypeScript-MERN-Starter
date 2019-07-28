import User from "./User";

export default interface UserState {
    currentUser: User | undefined;
    loading: boolean;
}