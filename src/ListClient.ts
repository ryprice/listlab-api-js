import {IPromise, resolve} from "q";

import authorizedRequest from "./authorizedRequest";
import CreatePublicListResponse from './CreatePublicListResponse';
import List from "./List";
import ListShare from "./ListShare";
import ListTask from "./ListTask";
import Payload from "./Payload";
import ListRole from "./ListRole";
import TaskApiConfig from "./TaskApiConfig";
import {consumeTasks} from "./TaskClient";
import {consumeListRole} from "./ListPermissionClient";

export default class ListClient {

  private listServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.listServiceAddress = `${config.ListServiceAddress}`;
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

  createPublicList(newList?: List): IPromise<CreatePublicListResponse> {
    let ajaxSettings: any = {
      url: `${this.listServiceAddress}/create-public`,
      method: "PUT",
    };
    if (newList != null) {
      ajaxSettings = {
        ...ajaxSettings,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(this.generateJson(newList))
      }
    }
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

  moveList(listId: number, parentId: number): IPromise<List> {
    const ajaxSettings: any = {
      url: `${this.listServiceAddress}/${listId}/move?parentId=${parentId}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  addShareToList(userId: number, listId: number, type: string): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?userId=${userId}&type=${type}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  removeShareFromList(userId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?userId=${userId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  getListDetails(listId: number): IPromise<Payload> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/details`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      const lists = consumeLists(json.lists);
      const list = lists[0];
      const roleUserToType = (roleUser: any): string => {
        let type = null;
        if (roleUser.roleId === list.readRole) {
          type = 'read';
        } else if (roleUser.roleId === list.writeRole) {
          type = 'write';
        }
        return type;
      };

      return {
        lists: lists,
        listShares: json.roleUsers.map((roleUser: any) => (
          new ListShare(listId, roleUser.userId, roleUserToType(roleUser))
        )),
        listRoles: json.listRoles.map(consumeListRole)
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
  list.readRole = json.readRole;
  list.writeRole = json.writeRole;
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
