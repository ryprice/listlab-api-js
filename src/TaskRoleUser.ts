export default class TaskRoleUser {

  public roleId: number;

  public userId: number;

  public constructor(roleId: number, userId: number) {
    this.roleId = roleId;
    this.userId = userId;
  }
}
