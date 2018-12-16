import {IPromise} from "q";

import authorizedRequest from "ququmber-api/authorizedRequest";
import TaskApiConfig from "ququmber-api/TaskApiConfig";
import TaskRole from "ququmber-api/TaskRole";
import TaskRoleType, {
  consumeTaskRoleType,
  generateTaskRoleTypeJson
} from "ququmber-api/TaskRoleType";

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
      method: "PUT"
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
      url: `${this.taskServiceAddress}/permission/${taskId}/role?s=${secret}&type=${generateTaskRoleTypeJson(type)}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskRole);
  }

  deleteRoleFromTask(taskId: number, roleId: number): IPromise<TaskRole> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/role?roleId=${roleId}`,
      method: "DELETE"
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
