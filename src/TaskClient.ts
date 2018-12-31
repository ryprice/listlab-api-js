import {IPromise, resolve} from "q";
import * as qs from 'qs';

import authorizedRequest from "ququmber-api/authorizedRequest";
import CreatePublicTaskResponse from "ququmber-api/CreatePublicTaskResponse";
import FuzzyGranularity from "ququmber-api/FuzzyGranularity";
import FuzzyTime from "ququmber-api/FuzzyTime";
import {consumePayloadResult} from "ququmber-api/InitClient";
import Payload from "ququmber-api/Payload";
import Recurrence from "ququmber-api/Recurrence";
import RecurrenceSchedule from "ququmber-api/RecurrenceSchedule";
import Task from "ququmber-api/Task";
import TaskApiConfig from "ququmber-api/TaskApiConfig";

export default class TaskClient {

  private config: TaskApiConfig;

  private taskServiceAddress: string;

  constructor(config: TaskApiConfig) {
    this.taskServiceAddress = config.TaskServiceAddress;
    this.config = config;
  }

  public getTask(id: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/task/${id}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json) => {
      return consumePayloadResult(json);
    });
  }

  public getTaskDetails(id: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/task/${id}/details`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumePayloadResult);
  }

  getTasks(): IPromise<Task[]> {
    const ajaxSettings = {
      url: this.taskServiceAddress,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumeTasks(json);
    });
  }

  private preTasks: Task[] = [];

  precreateTasks(): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/precreate`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      this.preTasks = this.preTasks.concat(consumeTasks(json));
    });
  }

  getPreTask(): Task {
    if (this.preTasks.length < 4) {
      this.precreateTasks();
    }
    return this.preTasks.shift();
  }

  search(query: string): IPromise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/search?q=${query}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumeTasks(json);
    });
  }

  getTaskChildren(taskId: number): IPromise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify({parentId: taskId})}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumePayloadResult(json).tasks;
    });
  }

  getTasksInProgress(): IPromise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/inprogress`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumePayloadResult(json).tasks;
    });
  }

  getTasksInRange(from: FuzzyTime, to: FuzzyTime, limit: number): IPromise<Task[]> {
    const data: any = {};
    if (from) {
      data.from = from.getTime().toISOString();
    }
    if (to) {
      data.to = to.getTime().toISOString();
    }
    if (limit) {
      data.limit = limit;
    }

    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?${qs.stringify(data)}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      const payload = consumePayloadResult(json);
      return payload.tasks;
    });
  }

  putTask(task: Task): IPromise<Task[]> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify(this.generateJson(task)),
      headers: {"Content-Type": "application/json"},
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumePayloadResult(json).tasks;
    });
  }

  putRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
      headers: {"Content-Type": "application/json"},
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => recurrence);
  }

  postRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/recurrence`,
      data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
      headers: {"Content-Type": "application/json"},
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => recurrence);
  }

  deleteRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  postTask(task: Task): IPromise<Payload> {
    const ajaxSettings: any = {
      url: `${this.taskServiceAddress}/task`,
      data: JSON.stringify(this.generateJson(task)),
      headers: {"Content-Type": "application/json"},
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) =>
      consumePayloadResult(json)
    );
  }

  postTasks(tasks: Task[]): void {
    for (const task of tasks) {
      this.postTask(task);
    }
  }

  moveTaskBefore(taskId: number, beforeId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/move?taskId=${taskId}&before=${beforeId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json) => {
      return consumePayloadResult(json);
    });
  }

  moveTaskAfter(taskId: number, afterId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/move?taskId=${taskId}&after=${afterId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json) => {
      return consumePayloadResult(json);
    });
  }

  moveTaskToParent(taskId: number, parentId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/move?taskId=${taskId}&parent=${parentId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  deleteTasks(taskIds: number[]): IPromise<number[]> {
    const idsQuery = qs.stringify({id: taskIds}, {arrayFormat: 'repeat'});
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?${idsQuery}`,
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => taskIds);
  }

  getParent(task: Task): IPromise<Payload> {
    if (task.parentId > 0) {
      return this.getTask(task.parentId);
    }
    return resolve(null);
  }

  assignTask(taskId: number, ownerId: number): IPromise<Task[]> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/assign?taskId=${taskId}&ownerId=${ownerId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  markSeen(taskId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/task/${taskId}/seen`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  getTasksByIds(ids: number[]): IPromise<Task[]> {
    if (ids.length < 1) return resolve([]);
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTasks);
  }

  getTasksInList(listId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/tasks?listId=${listId}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumePayloadResult);
  }

  removeTaskFromList(taskId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/list/${listId}/${taskId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  private addTaskToList(taskId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/list/${listId}/${taskId}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  addTasksToList(tasks: number[], listId: number): void {
    for (const task of tasks) {
      this.addTaskToList(task, listId);
    }
  }

  createPublicTask(newTask?: Task): IPromise<CreatePublicTaskResponse> {
    let ajaxSettings: any = {
      url: `${this.taskServiceAddress}/create-public`,
      method: "POST",
    };
    if (newTask != null) {
      ajaxSettings = {
        ...ajaxSettings,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(this.generateJson(newTask))
      };
    }
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return json as CreatePublicTaskResponse;
    });
  }

  generateJson(task: Task): Object {
    return {
      taskId: task.taskId,
      name: task.name,
      due: this.generateFuzzyTimeJson(task.due),
      userId: task.userId,
      parentId: task.parentId,
      completed: task.completed,
      dueOrder: task.dueOrder,
      seen: task.seen,
      recurrenceId: task.recurrenceId,
      creationTime: task.creationTime,
      completionTime: task.completionTime,
      readRole: task.readRole,
      writeRole: task.writeRole,
      author: task.author
    };
  }

  generateRecurrenceJson(recurrence: Recurrence): Object {
    return {
      recurrenceId: recurrence.recurrenceId,
      baseTaskId: recurrence.baseTaskId,
      from: this.generateFuzzyTimeJson(recurrence.schedule.from),
      to: this.generateFuzzyTimeJson(recurrence.schedule.to),
      period: recurrence.schedule.period.getName(),
      selected: recurrence.schedule.selected
    };
  }

  generateFuzzyTimeJson(fuzzyTime: FuzzyTime): Object {
    if (fuzzyTime) {
      return {
        time: fuzzyTime.getTime(),
        granularity: fuzzyTime.getGranularity().getName()
      };
    }
  }
}

export const consumeTasks = (json: any[]): Task[] => {
  const tasks = new Array<Task>();
  for (let i = 0; i < json.length; i++) {
    const entity = this.consumeTask(json[i]);
    tasks.push(entity);
  }
  return tasks;
};

export const consumeTask = (json: any) => {
  const task = new Task();
  task.taskId = json.taskId;
  task.name = json.name;
  task.userId = json.userId;
  task.completed = json.completed;
  task.parentId = json.parentId;
  task.childCount = json.childCount ? json.childCount : 0;
  task.incompleteChildCount = json.incompleteChildCount ? json.incompleteChildCount : 0;
  task.dueOrder = json.dueOrder;
  task.seen = json.seen;
  task.recurrenceId = json.recurrenceId;
  task.creationTime = json.creationTime && new Date(json.creationTime);
  task.completionTime = json.completionTime && new Date(json.completionTime);
  task.readRole = json.readRole;
  task.writeRole = json.writeRole;
  task.author = json.author;
  if (json.due) {
    task.due = consumeFuzzyTime(json.due);
  }
  return task;
};

export const consumeFuzzyTime = (json: any) => {
  return new FuzzyTime(
    new Date(json.time),
    consumeFuzzyGranularity(json.granularity)
  );
};

export const consumeFuzzyGranularity = (json: any) => {
  switch(json.toLowerCase()) {
    case "minute": return FuzzyGranularity.MINUTE;
    case "hour": return FuzzyGranularity.HOUR;
    case "day": return FuzzyGranularity.DAY;
    case "week": return FuzzyGranularity.WEEK;
    case "month": return FuzzyGranularity.MONTH;
    case "year": return FuzzyGranularity.YEAR;
    case "forever": return FuzzyGranularity.FOREVER;
    default: throw "Error in consumeTasks granularity unknown";
  }
};

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

export const consumeRecurrences = (json: any[]): Recurrence[] => {
  const recurrences = new Array<Recurrence>();
  for (let i = 0; i < json.length; i++) {
    const entity = this.consumeRecurrence(json[i]);
    recurrences.push(entity);
  }
  return recurrences;
};
