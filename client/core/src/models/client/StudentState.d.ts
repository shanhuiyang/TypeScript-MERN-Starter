import User from "../User";

export default interface StudentState {
    loading: boolean,
    valid: boolean,
    data: User[],
    loadingMore: boolean,
    hasMore: boolean,
    editCache: {}
}