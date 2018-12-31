import TaskRoleType from 'ququmber-api/TaskRoleType';

export default class TaskRole {

  public roleId: number;

  public taskId: number;

  public secret: string;

  public type: TaskRoleType;

  clone(): TaskRole {
    const newTaskRole = new TaskRole();
    newTaskRole.roleId = this.roleId;
    newTaskRole.taskId = this.taskId;
    newTaskRole.secret = this.secret;
    newTaskRole.type = this.type;
    return newTaskRole;
  }
}
