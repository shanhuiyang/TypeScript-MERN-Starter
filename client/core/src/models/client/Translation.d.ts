export default interface Translation {
    locale: string;
    messages: {[key: string]: any};
}