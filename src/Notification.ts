export default class Notification {
  public notificationId: number;
  public type: string;
  public userId: number;
  public data: any;
  public seen: boolean;

  clone(): Notification {
    const clone = new Notification();
    clone.notificationId = this.notificationId;
    clone.type = this.type;
    clone.userId = this.userId;
    clone.data = this.data;
    clone.seen = this.seen;
    return clone;
  }
}
