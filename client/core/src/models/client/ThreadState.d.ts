import User from "../User";
import Thread from "../Thread";

export default interface ThreadState {
    loading: boolean;
    valid: boolean;
    data: Thread[]; // current page threads, not all threads
    pageIndex: number;
    totalCount: number;
}