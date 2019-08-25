import * as qs from 'qs';

import authorizedRequest from 'ququmber-api/authorizedRequest';
import CreatePublicTaskResponse from 'ququmber-api/CreatePublicTaskResponse';
import FuzzyTime from 'ququmber-api/FuzzyTime';
import {
  consumeFuzzyGranularity,
  consumeFuzzyTime,
  generateFuzzyTimeJson
} from 'ququmber-api/fuzzyTimeSerialization';
import MaybeUser from 'ququmber-api/MaybeUser';
import Payload from 'ququmber-api/Payload';
import {consumePayloadResult} from 'ququmber-api/payloadSerialization';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';
import Recurrence from 'ququmber-api/Recurrence';
import RecurrenceSchedule from 'ququmber-api/RecurrenceSchedule';
import RequestQueue from 'ququmber-api/RequestQueue';
import Task from 'ququmber-api/Task';
import {consumeTasks, generateTaskJson} from 'ququmber-api/taskSerialization';

export default class TaskClient {

  private readonly config: QuqumberApiConfig;

  private readonly taskServiceAddress: string;

  private readonly requestQueue: RequestQueue;

  constructor(config: QuqumberApiConfig) {
    this.taskServiceAddress = config.TaskServiceAddress;
    this.config = config;
    this.requestQueue = new RequestQueue(this.config);
  }

  async getTaskDetails(id: number): Promise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/task/${id}/details`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json);
  }

  async getTasks(): Promise<Task[]> {
    const ajaxSettings = {
      url: this.taskServiceAddress,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeTasks(json);
  }

  private preTasks: Task[] = [];

  async precreateTasks(): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/precreate`,
      method: 'POST'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    this.preTasks = this.preTasks.concat(consumeTasks(json));
  }

  getPreTask(): Task {
    if (this.preTasks.length < 4) {
      this.precreateTasks();
    }
    return this.preTasks.shift();
  }

  async search(query: string): Promise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/search?q=${query}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeTasks(json);
  }

  async getTaskChildren(taskId: number): Promise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify({parentId: taskId})}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json).tasks;
  }

  async getTasksInProgress(): Promise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/inprogress`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json).tasks;
  }

  async getTasksInRange(from: FuzzyTime, to: FuzzyTime, limit: number): Promise<Task[]> {
    const data: any = {};
    if (from) {
      data.from = from.getTime().toISOString();
    }
    if (to) {
      data.to = to.getNext().getTime().toISOString();
    }
    if (limit) {
      data.limit = limit;
    }

    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify(data)}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    const payload = consumePayloadResult(json);
    return payload.tasks;
  }

  async putTask(task: Task): Promise<Task[]> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify(generateTaskJson(task)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    const json = await this.requestQueue.queue(ajaxSettings);
    return consumePayloadResult(json).tasks;
  }

  async putRecurrence(recurrence: Recurrence): Promise<Recurrence> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
    return recurrence;
  }

  async postRecurrence(recurrence: Recurrence): Promise<Recurrence> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/recurrence`,
      data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    await this.requestQueue.queue(ajaxSettings);
    return recurrence;
  }

  async deleteRecurrence(recurrence: Recurrence): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async postTask(task: Task): Promise<Payload> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify(generateTaskJson(task)),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    const json = await this.requestQueue.queue(ajaxSettings);
    return consumePayloadResult(json);
  }

  postTasks(tasks: Task[]): void {
    for (const task of tasks) {
      this.postTask(task);
    }
  }

  async moveTaskBefore(taskId: number, beforeId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/move?taskId=${taskId}&before=${beforeId}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async moveTaskAfter(taskId: number, afterId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/move?taskId=${taskId}&after=${afterId}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async moveTaskToParent(taskId: number, parentId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/move?taskId=${taskId}&parent=${parentId}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async moveTaskToParentBefore(taskId: number, parentId: number, before: number): Promise<void> {
    const query = qs.stringify({taskId, parent: parentId, before});
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/move?${query}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async moveTaskToParentAfter(taskId: number, parentId: number, after: number): Promise<void> {
    const query = qs.stringify({taskId, parent: parentId, after});
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/move?${query}`,
      method: 'PUT'
    };
    await this.requestQueue.queue(ajaxSettings);
  }

  async deleteTasks(taskIds: number[]): Promise<number[]> {
    const idsQuery = qs.stringify({id: taskIds}, {arrayFormat: 'repeat'});
    const ajaxSettings = {
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
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/assign?${qs.stringify(data)}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async markSeen(taskId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/task/${taskId}/seen`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async getTasksByIds(ids: number[]): Promise<Task[]> {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeTasks(json);
  }

  async getTasksInList(listId: number): Promise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?listId=${listId}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json);
  }

  async removeTaskFromList(taskId: number, listId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/list/${listId}/${taskId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  private async addTaskToList(taskId: number, listId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/list/${listId}/${taskId}`,
      method: 'POST'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async addTasksToList(tasks: number[], listId: number): Promise<void> {
    for (const task of tasks) {
      await this.addTaskToList(task, listId);
    }
  }

  async createPublicTask(newTask?: Task): Promise<CreatePublicTaskResponse> {
    let ajaxSettings: any = {
      url: `${this.taskServiceAddress}/create-public`,
      method: 'POST',
    };
    if (newTask != null) {
      ajaxSettings = {
        ...ajaxSettings,
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(generateTaskJson(newTask))
      };
    }
    const json = await authorizedRequest(this.config, ajaxSettings);
    return json as CreatePublicTaskResponse;
  }

  generateRecurrenceJson(recurrence: Recurrence): Object {
    return {
      recurrenceId: recurrence.recurrenceId,
      baseTaskId: recurrence.baseTaskId,
      from: generateFuzzyTimeJson(recurrence.schedule.from),
      to: generateFuzzyTimeJson(recurrence.schedule.to),
      period: recurrence.schedule.period.getName(),
      selected: recurrence.schedule.selected
    };
  }
}

export const consumeRecurrence = (json: any) => {
  const recurrence = new Recurrence();
  recurrence.recurrenceId = json.recurrenceId;
  recurrence.baseTaskId = json.baseTaskId;
  const schedule = new RecurrenceSchedule();
  schedule.to = consumeFuzzyTime(json.to);
  schedule.from = consumeFuzzyTime(json.from);
  schedule.period = consumeFuzzyGranularity(json.period);
  schedule.selected = json.selected;
  recurrence.schedule = schedule;
  return recurrence;
};

export const consumeRecurrences = (json: any): Recurrence[] => {
  const recurrences = new Array<Recurrence>();
  for (let i = 0; i < json.length; i++) {
    const entity = consumeRecurrence(json[i]);
    recurrences.push(entity);
  }
  return recurrences;
};
