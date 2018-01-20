export default class AuthSession {
  public userId: number;
  public name: string;
  public email: string;
  public isAnonymous: boolean;
  public settings: {[key: string]: string};
  public facebookId: string;
  public googleId: string;
  public username: string;

  clone(): AuthSession {
    const clone = new AuthSession();
    clone.userId = this.userId;
    clone.name = this.name;
    clone.email = this.email;
    clone.settings = this.settings;
    clone.facebookId = this.facebookId;
    clone.googleId = this.googleId;
    clone.username = this.username;
    return clone;
  }
}
