import { UnifiedModel } from "./UnifiedModel";

export default interface Article extends UnifiedModel {
    author: string; // User._id
    title: string;
    content: string;
    likes: string[]; // array of User._id
}