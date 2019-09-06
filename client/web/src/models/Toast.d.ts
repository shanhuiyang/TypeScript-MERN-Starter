export default interface Toast {
    success(msg: string): void;
    error(msg: string): void;
}