export default class Actor {
  public readonly actorId: number;
  public readonly userId: number;

  constructor(actorId: number, userId?: number) {
    this.actorId = actorId;
    this.userId = userId;
  }

  hasUserId() {
    return this.userId != null && this.userId > 0;
  }

  hasActorId(): boolean {
    return this.actorId != null && this.actorId > 0;
  }
}
