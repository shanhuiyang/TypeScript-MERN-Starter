import Post from "./Post.d";

export default interface Thread extends Post {
    title: string;
    content: string;
    removedEternally: boolean; // set to true if user removed but it has comments, then this thread is readonly
}