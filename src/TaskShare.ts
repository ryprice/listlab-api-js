export default class TaskShare {

  public taskId: number;

  public userId: number;

  public constructor(taskId: number, userId: number) {
    this.taskId = taskId;
    this.userId = userId;
  }
}
