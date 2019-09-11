export default interface ToastInterface {
    success(msg: string): void;
    error(msg: string): void;
}