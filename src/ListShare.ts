export default class ListShare {

    public listId: number;

    public userId: number;

    public type: string;

    public constructor(listId: number, userId: number, type: string) {
        this.listId = listId;
        this.userId = userId;
        this.type = type;
    }
}
