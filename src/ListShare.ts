import ListRoleType from 'ququmber-api/ListRoleType';

export default class ListShare {

  public listId: number;

  public userId: number;

  public type: ListRoleType;

  public constructor(listId: number, userId: number, type: ListRoleType) {
    this.listId = listId;
    this.userId = userId;
    this.type = type;
  }
}
