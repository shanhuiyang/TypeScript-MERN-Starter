export default function sleep(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
}