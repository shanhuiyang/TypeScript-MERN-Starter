export default interface ThreadActionCreator {
    getThreads(pageIndex: number, pageSize: number): any;
    createThread(title: string, content: string, author: string): any;
    removeThread(id: string): any;
    rateThread(rating: number, id: string, user: string): any;
}