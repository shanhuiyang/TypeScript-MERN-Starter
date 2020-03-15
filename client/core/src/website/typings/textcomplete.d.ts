declare module "textcomplete" {
    class Textarea { constructor(textarea: HTMLTextAreaElement); }
    class Textcomplete { constructor(textarea: Textarea, options?: any); }
    export { Textcomplete, Textarea };
}