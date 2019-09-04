import { UnifiedModel } from "../models/UnifiedModel";

export const byCreatedAt = (first: UnifiedModel, second: UnifiedModel): number => {
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

export const byUpdatedAt = (first: UnifiedModel, second: UnifiedModel): number => {
    if (!first || !first.updatedAt) {
        return 1;
    }
    if (!second || !second.updatedAt) {
        return -1;
    }
    const firstDate: any = new Date(first.updatedAt);
    const secondDate: any = new Date(second.updatedAt);
    return secondDate - firstDate;
};