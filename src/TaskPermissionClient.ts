import authorizedRequest from 'ququmber-api/authorizedRequest';
import TaskApiConfig from 'ququmber-api/TaskApiConfig';
import TaskRole from 'ququmber-api/TaskRole';
import TaskRoleType, {
  consumeTaskRoleType,
  generateTaskRoleTypeJson
} from 'ququmber-api/TaskRoleType';
import TaskRoleUser from 'ququmber-api/TaskRoleUser';

export default class TaskPermissionClient {

  private taskServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.taskServiceAddress = config.TaskServiceAddress;
  }

  async userKnowsSecret(taskId: number, secret: string): Promise<void> {
    const ajaxSettings = {
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
    const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?s=${secret}&type=${generateTaskRoleTypeJson(type)}`,
      method: 'POST'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeTaskRole(json);
  }

  async removeRoleFromTask(taskId: number, roleId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/role?roleId=${roleId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async addUserToTask(userId: number, taskId: number, type: TaskRoleType): Promise<void> {
    const ajaxSettings = {
      url: (
        `${this.taskServiceAddress}/permission/${taskId}/user` +
        `?userId=${userId}&type=${generateTaskRoleTypeJson(type)}`
      ),
      method: 'POST'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async removeUserFromTask(userId: number, taskId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskId}/user?userId=${userId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async updateTaskRole(taskRole: TaskRole): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/permission/${taskRole.taskId}/role?roleId=${taskRole.roleId}`,
      method: 'PUT',
      data: generateTaskRoleJson(taskRole)
    };
    await authorizedRequest(this.config, ajaxSettings);
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
