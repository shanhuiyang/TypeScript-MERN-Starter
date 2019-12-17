import User from "../User.d";
import Article from "../Article.d";
export default interface GetArticlesResponse {
    data: Article[];
    authors: {[id: string]: User};
    hasMore: boolean;
}