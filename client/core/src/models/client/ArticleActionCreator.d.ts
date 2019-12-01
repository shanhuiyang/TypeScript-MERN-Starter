import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import Article from "../Article";

export default interface ArticleActionCreator extends ActionCreatorsMapObject {
    getAllArticles(): any;
    createArticle(title: string, content: string, author: string): any;
    editArticle(article: Article): any;
    removeArticle(id: string): any;
    rateArticle(rating: number, id: string): any;
}