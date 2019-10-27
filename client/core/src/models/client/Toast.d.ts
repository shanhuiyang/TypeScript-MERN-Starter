/**
 * the interface to make the toast showing messages
 * @param message could be the message id used by translation or the display text
 */
export default interface ToastInterface {
    success(message: string): void;
    error(message: string): void;
}