export default interface StorageInterface {
    getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;

    setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;

    removeItem(key: string, callback?: (error?: Error) => void): Promise<void>;

    clear(callback?: (error?: Error) => void): Promise<void>;

    getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;
}