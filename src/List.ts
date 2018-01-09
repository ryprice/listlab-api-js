export default class List {
  public listId: number;
  public userId: number;
  public name: string;
  public color: string;
  public sortOrder: number;
  public parentId: number;
  public publicReadRole: number;
  public publicWriteRole: number;

  clone(): List {
    const clone = new List();
    clone.listId = this.listId;
    clone.userId = this.userId;
    clone.name = this.name;
    clone.color = this.color;
    clone.sortOrder = this.sortOrder;
    clone.parentId = this.parentId;
    clone.publicReadRole = this.publicReadRole;
    clone.publicWriteRole = this.publicWriteRole;
    return clone;
  }
}
