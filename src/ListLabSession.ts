export default class ListLabSession {
  public userId: number;
  public token: string;

  clone(): ListLabSession {
    const clone = new ListLabSession();
    clone.userId = this.userId;
    clone.token = this.token;
    return clone;
  }
}
