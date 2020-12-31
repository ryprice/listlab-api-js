class UserDetails {
  public userId: number;
  public actorId: number;
  public name: string;
  public email: string;
  public settings: {[key: string]: string};
  public facebookId: string;
  public googleId: string;
  public username: string;
  public pendingEmail: string;
  public gates: {[key: string]: string};

  clone(): UserDetails {
    const clone = new UserDetails();
    clone.userId = this.userId;
    clone.actorId = this.actorId;
    clone.name = this.name;
    clone.email = this.email;
    clone.settings = this.settings || {};
    clone.facebookId = this.facebookId;
    clone.googleId = this.googleId;
    clone.username = this.username;
    clone.pendingEmail = this.pendingEmail;
    clone.gates = this.gates || {};
    return clone;
  }
}
export default UserDetails;
