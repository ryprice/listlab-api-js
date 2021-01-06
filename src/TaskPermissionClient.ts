import {AxiosRequestConfig} from 'axios';

import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import TaskRole from 'listlab-api/TaskRole';
import {
  restJsonToTaskRole,
  taskRoleToRestJson,
  taskRoleTypeToRestJson
} from 'listlab-api/taskRoleSerialization';
import TaskRoleType from 'listlab-api/TaskRoleType';
import randomToken from 'listlab-api/utils/randomToken';

export default class TaskPermissionClient {

  private readonly taskServiceAddress: string;

  private readonly config: ListlabApiConfig;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.taskServiceAddress = config.TaskServiceAddress;
  }

  async userKnowsSecret(taskId: number, secret: string): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?s=${secret}`,
      method: 'POST'
    };
    try {
      await authorizedRequest(this.config, ajaxSettings);
    } catch {
      () => console.log('failed to auth to this task');
    }
  }

  async addRoleToTask(taskId: number, type: TaskRoleType): Promise<TaskRole> {
    const secret = randomToken(64);
    const ajaxSettings: AxiosRequestConfig = {
      url: (
        `${this.taskServiceAddress}/permission/${taskId}/role` +
        `?s=${secret}&type=${taskRoleTypeToRestJson(type)}`
      ),
      method: 'POST'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToTaskRole(json);
  }

  async removeRoleFromTask(taskId: number, roleId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/permission/${taskId}/role?roleId=${roleId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async addUserToTask(userId: number, taskId: number, type: TaskRoleType): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: (
        `${this.taskServiceAddress}/permission/${taskId}/user` +
        `?userId=${userId}&type=${taskRoleTypeToRestJson(type)}`
      ),
      method: 'POST'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async removeUserFromTask(userId: number, taskId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?userId=${userId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async updateTaskRole(taskRole: TaskRole): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/permission/${taskRole.taskId}/role?roleId=${taskRole.roleId}`,
      method: 'PUT',
      data: taskRoleToRestJson(taskRole)
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}
