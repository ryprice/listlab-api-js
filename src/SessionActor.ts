import UserDetails from 'listlab-api/UserDetails';

class SessionActor {
  public userId: number;
  public actorId: number;
  public user: UserDetails;

  clone(): SessionActor {
    const clone = new SessionActor();
    clone.userId = this.userId;
    clone.actorId = this.actorId;
    clone.user = this.user.clone();
    return clone;
  }
}

export default SessionActor;
