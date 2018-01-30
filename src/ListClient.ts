import {IPromise, resolve} from "q";

import authorizedRequest from "./authorizedRequest";
import CreatePublicListResponse from './CreatePublicListResponse';
import List from "./List";
import ListShare from "./ListShare";
import ListTask from "./ListTask";
import Payload from "./Payload";
import Role from "./Role";
import TaskApiConfig from "./TaskApiConfig";
import {consumeTasks} from "./TaskClient";

export default class ListClient {

  private listServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.listServiceAddress = `${config.TaskServiceAddress}/list`;
  }

  public getList(listId: number): IPromise<List> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json) => {
      return consumeList(json);
    });
  }

  getLists(): IPromise<List[]> {
    const ajaxSettings = {
      url: this.listServiceAddress,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumeLists(json);
    });
  }

  deleteList(list: List): IPromise<List> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${list.listId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {
      return list;
    });
  }

  putList(list: List): IPromise<List> {
    const ajaxSettings: any = {
      url: this.listServiceAddress,
      data: JSON.stringify(this.generateJson(list)),
      headers: {"Content-Type": "application/json"},
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      const persistedId = this.consumeInsertResult(json);
      list.listId = persistedId;
      return list;
    });
  }

  createPublicList(): IPromise<CreatePublicListResponse> {
    const ajaxSettings: any = {
      url: `${this.listServiceAddress}/create-public`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return json as CreatePublicListResponse;
    });
  }



  postList(list: List): IPromise<List> {
    const ajaxSettings: any = {
      url: this.listServiceAddress,
      data: JSON.stringify(this.generateJson(list)),
      headers: {"Content-Type": "application/json"},
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => list);
  }

  getTasksInList(listId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/tasks`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      return consumeListTasks(listId, json);
    });
  }

  removeTaskFromList(taskId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/${taskId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  private addTaskToList(taskId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/${taskId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  addTasksToList(tasks: number[], listId: number): void {
    for (const task of tasks) {
      this.addTaskToList(task, listId);
    }
  }

  addShareToList(userId: number, listId: number, type: string): IPromise<void> {
    const ajaxSettings = {
      url: `${this.config.TaskServiceAddress}/role/list/${listId}/share?userId=${userId}&type=${type}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  removeShareFromList(userId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.config.TaskServiceAddress}/role/list/${listId}/share?userId=${userId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  getListDetails(listId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.config.TaskServiceAddress}/list/${listId}/details`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      const lists = consumeLists(json.lists);
      const list = lists[0];
      const roleUserToType = (roleUser: any): string => {
        let type = null;
        if (roleUser.roleId === list.publicReadRole) {
          type = 'read';
        } else if (roleUser.roleId === list.publicWriteRole) {
          type = 'write';
        }
        return type;
      };

      return {
        lists: lists,
        listShares: json.roleUsers.map((roleUser: any) => (
          new ListShare(listId, roleUser.userId, roleUserToType(roleUser))
        )),
        roles: json.roles.map((role: any) => new Role(role.roleId, role.secret))
      } as Payload;
    });
  }

  getListsByIds(ids: number[]): IPromise<List[]> {
    if (ids.length < 1) return resolve([]);
    const ajaxSettings = {
      url: `${this.listServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeLists);
  }

  constructEmptyEntity(): List {
    return new List();
  }

  consumeInsertResult(json: any): number {
    if (json.id) {
      return json.id;
    } else {
      return 0;
    }
  }

  generateJson(list: List): Object {
    return {
      listId: list.listId,
      name: list.name,
      userId: list.userId,
      color: list.color,
      sortOrder: list.sortOrder,
      parentId: list.parentId
    };
  }

  getEntityId(list: List) {
    return list.listId;
  }

  setEntityId(list: List, id: number) {
    list.listId = id;
  }
}

export const consumeList = (json: any): List => {
  const list = new List();
  list.listId = json.listId;
  list.userId = json.userId;
  list.name = json.name;
  list.color = json.color;
  list.sortOrder = json.sortOrder;
  list.parentId = json.parentId;
  list.publicReadRole = json.publicReadRole;
  list.publicWriteRole = json.publicWriteRole;
  if (json.tasks) {
    this.consumeListTasks(list, json.tasks);
  }
  return list;
};

export const consumeLists = (json: any[]): List[] => {
  const lists = new Array<List>();
  for (let i = 0; i < json.length; i++) {
    const list = this.consumeList(json[i]);
    lists.push(list);
  }

  return lists;
};

export const consumeListTasks = (listId: number, json: any): Payload => {
  const payload = new Payload();
  payload.tasks = consumeTasks(json);
  payload.listTasks = [];
  for (const task of payload.tasks) {
    const listTask = new ListTask(listId, task.taskId);
    payload.listTasks.push(listTask);
  }
  return payload;
};
