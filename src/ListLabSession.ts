export default class ListLabSession {
  public userId: number;
  public token: string;
  public actorId: number;

  clone(): ListLabSession {
    const clone = new ListLabSession();
    clone.userId = this.userId;
    clone.token = this.token;
    clone.actorId = this.actorId;
    return clone;
  }
}
