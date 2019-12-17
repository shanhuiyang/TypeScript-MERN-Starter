import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import Article from "../Article";

export default interface ArticleActionCreator extends ActionCreatorsMapObject {
    getArticles(): any;
    getMoreArticles(earlierThan: string): any;
    createArticle(title: string, content: string, author: string): any;
    editArticle(article: Article): any;
    removeArticle(id: string): any;
    rateArticle(rating: number, id: string, user: string): any;
}