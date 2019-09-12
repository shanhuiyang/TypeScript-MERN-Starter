import StorageInterface from "../models/client/Storage";

// tslint:disable-next-line:no-var-keyword
var storage: StorageInterface;

export const initStorage = (storageImplementation: StorageInterface): void => {
    storage = storageImplementation;
};

export const getStorage = (): StorageInterface => {
    return storage;
};