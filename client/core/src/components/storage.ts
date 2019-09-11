import StorageInterface from "../models/client/Storage.d";

const storageWrapper: StorageInterface = {

    getItem(key: string): Promise<string | null> {
        return new Promise((
                resolve: (value: string | null) => void,
                reject: (reason?: any) => void
                ) => {
            resolve(localStorage.getItem(key));
        });
    },

    setItem(key: string, value: string): Promise<void> {
        return new Promise((
                resolve: () => void,
                reject: (reason?: any) => void
                ) => {
            localStorage.setItem(key, value);
            resolve();
        });
    }
};

export default storageWrapper;