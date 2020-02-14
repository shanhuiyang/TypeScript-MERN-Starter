import StorageInterface from "../../models/client/Storage";

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
    },
    removeItem(key: string): Promise<void> {
        return new Promise((
                resolve: () => void,
                reject: (reason?: any) => void
                ) => {
            localStorage.removeItem(key);
            resolve();
        });
    },
    clear(): Promise<void> {
        return new Promise((
                resolve: () => void,
                reject: (reason?: any) => void
                ) => {
            localStorage.clear();
            resolve();
        });
    },
    getAllKeys(): Promise<string[]> {
        return new Promise((
                resolve: (value: string[]) => void,
                reject: (reason?: any) => void
                ) => {
            const keys: string[] = [];
            for (let i: number = 0; i < localStorage.length; ++i) {
                keys[i] = localStorage.key(i) as string;
            }
            resolve(keys);
        });
    }
};

export default storageWrapper;