import { UnifiedModel } from "./UnifiedModel";

export default interface Article extends UnifiedModel {
    author: any; // User._id
    title: string;
    content: string;
    likes: any[]; // array of User._id
}