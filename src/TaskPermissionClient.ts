import {IPromise} from "q";

import authorizedRequest from "ququmber-api/authorizedRequest";
import TaskApiConfig from "ququmber-api/TaskApiConfig";
import TaskRole from "ququmber-api/TaskRole";
import TaskRoleType, {
  consumeTaskRoleType,
  generateTaskRoleTypeJson
} from "ququmber-api/TaskRoleType";
import TaskRoleUser from "ququmber-api/TaskRoleUser";

export default class TaskPermissionClient {

  private taskServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.taskServiceAddress = config.TaskServiceAddress;
  }

  userKnowsSecret(taskId: number, secret: string): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?s=${secret}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings)
      .then(
        (json) => { },
        () => console.log("failed to auth to this task")
      );
  }

  addRoleToTask(taskId: number, type: TaskRoleType): IPromise<TaskRole> {
    const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?s=${secret}&type=${generateTaskRoleTypeJson(type)}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskRole);
  }

  removeRoleFromTask(taskId: number, roleId: number): IPromise<TaskRole> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/role?roleId=${roleId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  addUserToTask(userId: number, taskId: number, type: TaskRoleType): IPromise<void> {
    const ajaxSettings = {
      url: (
        `${this.taskServiceAddress}/permission/${taskId}/user` +
        `?userId=${userId}&type=${generateTaskRoleTypeJson(type)}`
      ),
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  removeUserFromTask(userId: number, taskId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?userId=${userId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  updateTaskRole(taskRole: TaskRole): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskRole.taskId}/role?roleId=${taskRole.roleId}`,
      method: "PUT",
      data: generateTaskRoleJson(taskRole)
    };
    return authorizedRequest(this.config, ajaxSettings);
  }
}

export const consumeTaskRole = (json: any): TaskRole => {
  const taskRole = new TaskRole();
  taskRole.roleId = json.roleId;
  taskRole.taskId = json.taskId;
  taskRole.secret = json.secret;
  taskRole.type = consumeTaskRoleType(json.type);
  return taskRole;
};

export const consumeTaskRoleUser = (json: any): TaskRoleUser => {
  return new TaskRoleUser(json.roleId, json.userId);
};

export const generateTaskRoleJson = (taskRole: TaskRole): Object => ({
  roleId: taskRole.roleId,
  taskId: taskRole.taskId,
  type: taskRole.type,
  secret: taskRole.secret
});
