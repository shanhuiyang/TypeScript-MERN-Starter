export default interface ToastInterface {
    success(messageId: string): void;
    error(messageId: string): void;
}