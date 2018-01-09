export default class ListTask {

  public listId: number;

  public taskId: number;

  public constructor(listId: number, taskId: number) {
    this.listId = listId;
    this.taskId = taskId;
  }
}
