import authorizedRequest from 'ququmber-api/authorizedRequest';
import {consumeLists} from 'ququmber-api/ListClient';
import ListTask from 'ququmber-api/ListTask';
import Payload from 'ququmber-api/Payload';
import TaskApiConfig from 'ququmber-api/TaskApiConfig';
import {
  consumeRecurrences,
  consumeTasks
} from 'ququmber-api/TaskClient';
import {consumeTaskRole, consumeTaskRoleUser} from 'ququmber-api/TaskPermissionClient';
import {consumeUsers} from 'ququmber-api/UserClient';

export default class InitClient {

  private initServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.initServiceAddress = `${config.TaskServiceAddress}/todoweb`;
  }

  public async init(): Promise<Payload> {
    const ajaxSettings = {
      url: `${this.initServiceAddress}/init`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json);
  }
}

export const consumePayloadResult = (json: any): Payload => {
  const payload = new Payload();
  if (json.tasks) {
    payload.tasks = consumeTasks(json.tasks);
  }
  if (json.listTasks) {
    const listTasks: ListTask[] = [];
    for (const lt of json.listTasks) {
      const listTask = new ListTask(lt.listId, lt.taskId);
      listTasks.push(listTask);
    }
    payload.listTasks = listTasks;
  }
  if (json.lists) {
    payload.lists = consumeLists(json.lists);
  }
  if (json.taskRoles) {
    payload.taskRoles = json.taskRoles.map(consumeTaskRole);
  }
  if (json.taskRoleUsers) {
      payload.taskRoleUsers = json.listRoleUsers.map(consumeTaskRoleUser);
  }
  if (json.recurrences) {
    payload.recurrences = consumeRecurrences(json.recurrences);
  }
  if (json.users) {
    payload.users = consumeUsers(json.users);
  }
  return payload;
};
