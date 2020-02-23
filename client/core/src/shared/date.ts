/**
 * Sort predicates for dates.
 */
import Post from "../models/Post.d";

export const byCreatedAtLatestFirst = (first: Post, second: Post): number => {
    if (!first || !first.createdAt) {
        return 1;
    }
    if (!second || !second.createdAt) {
        return -1;
    }
    const firstDate: any = new Date(first.createdAt);
    const secondDate: any = new Date(second.createdAt);
    return secondDate - firstDate;
};

export const byCreatedAtOldestFirst = (first: Post, second: Post): number => {
    return byCreatedAtLatestFirst(second, first);
};

export const byCommentedAtLatestFirst = (first: Post, second: Post): number => {
    if (!first || !first.lastCommentedAt) {
        return 1;
    }
    if (!second || !second.lastCommentedAt) {
        return -1;
    }
    const firstDate: any = new Date(first.lastCommentedAt);
    const secondDate: any = new Date(second.lastCommentedAt);
    return secondDate - firstDate;
};

export const byCommentedAtOldestFirst = (first: Post, second: Post): number => {
    return byCommentedAtLatestFirst(second, first);
};