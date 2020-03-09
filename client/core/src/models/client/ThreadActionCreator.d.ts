export default interface ThreadActionCreator {
    getThreads(pageIndex: number, pageSize: number): any;
    addThread(title: string, content: string, author: string, mentions?: string[]): any;
    removeThread(id: string): any;
    rateThread(rating: number, id: string, user: string): any;
}