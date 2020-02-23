import Thread from "../Thread.d";
import User from "../User.d";

export default interface GetThreadsResponse {
    data: Thread [];
    authors: {[id: string]: User};
    totalCount: number;
}