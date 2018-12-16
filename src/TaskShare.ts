import TaskRoleType from 'ququmber-api/TaskRoleType';

export default class TaskShare {

  public taskId: number;

  public userId: number;

  public type: TaskRoleType;

  public constructor(taskId: number, userId: number, type: TaskRoleType) {
    this.taskId = taskId;
    this.userId = userId;
    this.type = type;
  }
}
