import TaskRoleType from 'ququmber-api/TaskRoleType';

export default class TaskRole {

  public roleId: number;

  public taskId: number;

  public secret: string;

  public type: TaskRoleType;
}
