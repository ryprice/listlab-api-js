import Actor from 'listlab-api/Actor';
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

  equalsActor(actor: Actor) {
    return (
      (actor.userId != null && actor.userId === this.userId) ||
      (actor.actorId != null && actor.actorId === this.actorId)
    );
  }
}

export default SessionActor;
