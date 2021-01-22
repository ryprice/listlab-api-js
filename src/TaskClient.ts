import {AxiosRequestConfig} from 'axios';
import * as qs from 'qs';

import authorizedRequest from 'listlab-api/authorizedRequest';
import CreatePublicTaskResponse from 'listlab-api/CreatePublicTaskResponse';
import FuzzyTime from 'listlab-api/FuzzyTime';
import {
  restJsonToFuzzyGranularity,
  restJsonToFuzzyTime,
  fuzzyTimeToRestJson
} from 'listlab-api/fuzzyTimeSerialization';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import MaybeUser from 'listlab-api/MaybeUser';
import Payload from 'listlab-api/Payload';
import {restJsonToPayloadResult} from 'listlab-api/payloadSerialization';
import Recurrence from 'listlab-api/Recurrence';
import RecurrenceSchedule from 'listlab-api/RecurrenceSchedule';
import RequestQueue from 'listlab-api/RequestQueue';
import Task from 'listlab-api/Task';
import TaskFilter from 'listlab-api/TaskFilter';
import {taskFilterToRestJson} from 'listlab-api/taskFilterSerialization';
import TaskMoveParams from 'listlab-api/TaskMoveParams';
import TaskMutation from 'listlab-api/TaskMutation';
import {restJsonToTasks, taskToRestJson, restJsonToTaskDueOrders} from 'listlab-api/taskSerialization';

type PostTaskParams = {
  parent?: number;
  before?: number;
  after?: number;
  orderType?: string;
};

export default class TaskClient {

  private readonly config: ListlabApiConfig;

  private readonly taskServiceAddress: string;

  private readonly requestQueue: RequestQueue;

  constructor(config: ListlabApiConfig) {
    this.taskServiceAddress = config.TaskServiceAddress;
    this.config = config;
    this.requestQueue = new RequestQueue(this.config);
  }

  async getTaskRootOrder() {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/init/app`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    const payload = restJsonToPayloadResult(json);
    return payload.taskRootOrder;
  }

  async getTaskDueOrders(dues: FuzzyTime[]) {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/dueorder?${dues
        .map(due => `due=${encodeURI(JSON.stringify(fuzzyTimeToRestJson(due)))}&`)
        .join('')
      }`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToTaskDueOrders(json);
  }

  async getTaskDetails(id: number): Promise<Payload> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task/${id}/details`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  private preTasks: Task[] = [];

  async precreateTasks(): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks/precreate`,
      method: 'POST'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    this.preTasks = this.preTasks.concat(restJsonToTasks(json));
  }

  getPreTask(): Task {
    if (this.preTasks.length < 4) {
      this.precreateTasks();
    }
    return this.preTasks.shift();
  }

  async search(query: string): Promise<Payload> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/search?q=${query}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  async getTasksInFilter(filter: TaskFilter): Promise<Payload> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify({
        filter: taskFilterToRestJson(filter)
      })}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  async getTasks(args: {
    continuation: number,
    limit: number,
    sort?: string,
  }) {
    const {continuation, sort, limit} = args;
    const data: any = {
      limit,
    };
    if (continuation) {
      data.continuation = continuation;
    }
    if (sort) {
      data.sort = sort;
    }
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify(data)}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  async putTasks(tasks: Task[]): Promise<Task[]> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify(tasks.map(taskToRestJson)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    const json = await this.requestQueue.queue(ajaxSettings);
    return restJsonToPayloadResult(json).tasks;
  }

  async putRecurrence(recurrence: Recurrence): Promise<Recurrence> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      data: JSON.stringify(this.recurrenceToRestJson(recurrence)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
    return recurrence;
  }

  async postRecurrence(recurrence: Recurrence): Promise<Recurrence> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/recurrence`,
      data: JSON.stringify(this.recurrenceToRestJson(recurrence)),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    await this.requestQueue.queue(ajaxSettings);
    return recurrence;
  }

  async deleteRecurrence(recurrence: Recurrence): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async postTask(task: Task, params?: PostTaskParams): Promise<Payload> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify({task: taskToRestJson(task), ...params}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    const json = await this.requestQueue.queue(ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  postTasks(tasks: Task[], params?: PostTaskParams): void {
    for (const task of tasks) {
      this.postTask(task, params);
    }
  }

  async moveTask(taskId: number, moveParams: TaskMoveParams): Promise<void> {
    const {before, after, parent, type} = moveParams;
    const ajaxSettings: AxiosRequestConfig = {
      url: (
        `${this.taskServiceAddress}/move` +
        `?taskId=${taskId}&orderType=${type}` +
        (before != null ? `&before=${before}` : '') +
        (after != null ? `&after=${after}` : '') +
        (parent != null ? `&parent=${parent}` : '')
      ),
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async moveTaskToParent(taskId: number, parentId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/move?taskId=${taskId}&parent=${parentId}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async deleteTasks(taskIds: number[]): Promise<number[]> {
    const idsQuery = qs.stringify({id: taskIds}, {arrayFormat: 'repeat'});
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks?${idsQuery}`,
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    };
    await this.requestQueue.queue(ajaxSettings);
    return taskIds;
  }

  async assignTask(taskId: number, maybeUser: MaybeUser): Promise<void> {
    const data: any = {taskId};
    if (maybeUser.userId) {
      data.ownerId = maybeUser.userId;
    }
    if (maybeUser.name) {
      data.ownerName = maybeUser.name;
    }
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks/assign?${qs.stringify(data)}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async markSeen(taskId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task/${taskId}/seen`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async markUnseen(taskId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task/${taskId}/unseen`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }


  async markInbox(taskIds: number[]): Promise<void> {
    const idsQuery = qs.stringify({id: taskIds}, {arrayFormat: 'repeat'});
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task/inbox?${idsQuery}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async markUninbox(taskIds: number[]): Promise<void> {
    const idsQuery = qs.stringify({id: taskIds}, {arrayFormat: 'repeat'});
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/task/uninbox?${idsQuery}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async getTasksByIds(ids: number[]): Promise<Task[]> {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/tasks/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToTasks(json);
  }

  async removeTasksFromList(taskIds: number[], listId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: (
        `${this.taskServiceAddress}/list/${listId}/delete-tasks?` +
        taskIds.map(taskId => `taskId=${taskId}&`).join('')
      ),
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async addTasksToList(taskIds: number[], listId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: (
        `${this.taskServiceAddress}/list/${listId}/add-tasks?` +
        taskIds.map(taskId => `taskId=${taskId}&`).join('')
      ),
      method: 'POST',
      data: taskIds,
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async sendMutations(mutations: TaskMutation[]) {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/mutate`,
      method: 'PUT',
      data: mutations,
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async createPublicTask(newTask?: Task): Promise<CreatePublicTaskResponse> {
    let ajaxSettings: AxiosRequestConfig = {
      url: `${this.taskServiceAddress}/create-public`,
      method: 'POST',
    };
    if (newTask != null) {
      ajaxSettings = {
        ...ajaxSettings,
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(taskToRestJson(newTask))
      };
    }
    const json = await authorizedRequest(this.config, ajaxSettings);
    return json as CreatePublicTaskResponse;
  }

  recurrenceToRestJson(recurrence: Recurrence): Object {
    return {
      recurrenceId: recurrence.recurrenceId,
      baseTaskId: recurrence.baseTaskId,
      from: fuzzyTimeToRestJson(recurrence.schedule.from),
      to: fuzzyTimeToRestJson(recurrence.schedule.to),
      period: recurrence.schedule.period.getName(),
      selected: recurrence.schedule.selected
    };
  }

  addRequestQueueListener(l: (isRunning: boolean) => void) {
    this.requestQueue.addListener(l);
  }

  removeRequestQueueListener(l: (isRunning: boolean) => void) {
    this.requestQueue.removeListener(l);
  }
}

export const restJsonToRecurrence = (json: any) => {
  const recurrence = new Recurrence();
  recurrence.recurrenceId = json.recurrenceId;
  recurrence.baseTaskId = json.baseTaskId;
  const schedule = new RecurrenceSchedule();
  schedule.to = restJsonToFuzzyTime(json.to);
  schedule.from = restJsonToFuzzyTime(json.from);
  schedule.period = restJsonToFuzzyGranularity(json.period);
  schedule.selected = json.selected;
  recurrence.schedule = schedule;
  return recurrence;
};

export const restJsonToRecurrences = (json: any): Recurrence[] => {
  const recurrences = new Array<Recurrence>();
  for (let i = 0; i < json.length; i++) {
    const entity = restJsonToRecurrence(json[i]);
    recurrences.push(entity);
  }
  return recurrences;
};