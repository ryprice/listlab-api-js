export default class Role {

  public roleId: number;

  public secret: string;

  public constructor(roleId: number, secret: string) {
    this.roleId = roleId;
    this.secret = secret;
  }
}
