export default interface StorageInterface {
    getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;

    setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;
}