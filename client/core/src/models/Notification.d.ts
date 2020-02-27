import { UnifiedModel } from "./UnifiedModel";
import InteractionType from "./InteractionType";
import PostType from "./PostType";
export default interface Notification extends UnifiedModel {
    owner: string; // User._id
    acknowledged: boolean;
    subject: string; // User._id
    event: InteractionType; // Like, Mention and Comment
    objectType: PostType;
    object: string; // Article._id and Comment._id, etc
    link: string; // For owner to click
    objectText: string; // Article.title or something else
}