import {IPromise} from "q";

import authorizedRequest from "ququmber-api/authorizedRequest";
import ListRole from "ququmber-api/ListRole";
import ListRoleType, {
  consumeListRoleType,
  generateListRoleTypeJson
} from "ququmber-api/ListRoleType";
import ListRoleUser from "ququmber-api/ListRoleUser";
import TaskApiConfig from "ququmber-api/TaskApiConfig";

export default class ListPermissionClient {

  private listServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.listServiceAddress = config.ListServiceAddress;
  }

  userKnowsSecret(listId: number, secret: string): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?s=${secret}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings)
      .then(
        (json) => { },
        () => console.log("failed to auth to this list")
      );
  }

  addUserToList(userId: number, listId: number, type: ListRoleType): IPromise<void> {
    const ajaxSettings = {
      url: (
        `${this.listServiceAddress}/permission/${listId}/user` +
        `?userId=${userId}&type=${generateListRoleTypeJson(type)}`
      ),
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  removeUserFromList(userId: number, listId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?userId=${userId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  addRoleToList(listId: number, type: ListRoleType): IPromise<ListRole> {
    const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?s=${secret}&type=${generateListRoleTypeJson(type)}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeListRole);
  }

  removeRoleFromList(listId: number, roleId: number): IPromise<ListRole> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?roleId=${roleId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  updateListRole(listRole: ListRole): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listRole.listId}/role?roleId=${listRole.roleId}`,
      method: "PUT",
      data: generateListRoleJson(listRole)
    };
    return authorizedRequest(this.config, ajaxSettings);
  }
}

export const consumeListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = json.roleId;
  listRole.listId = json.listId;
  listRole.secret = json.secret;
  listRole.type = consumeListRoleType(json.type);
  return listRole;
};

export const consumeListRoleUser = (json: any): ListRoleUser => {
  const listRoleUser = new ListRoleUser(json.roleId, json.userId);
  return listRoleUser;
};

export const generateListRoleJson = (listRole: ListRole): Object => ({
  roleId: listRole.roleId,
  listId: listRole.listId,
  type: listRole.type,
  secret: listRole.secret
});
