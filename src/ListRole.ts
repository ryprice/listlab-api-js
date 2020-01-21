import ListRoleType from 'listlab-api/ListRoleType';

export default class ListRole {

  public roleId: number;

  public listId: number;

  public secret: string;

  public type: ListRoleType;

  clone() {
    const newListRole = new ListRole();
    newListRole.roleId = this.roleId;
    newListRole.listId = this.listId;
    newListRole.secret = this.secret;
    newListRole.type = this.type;
    return newListRole;
  }
}
