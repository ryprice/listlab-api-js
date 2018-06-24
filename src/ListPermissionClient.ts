import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import ListRole from "./ListRole";
import TaskApiConfig from "./TaskApiConfig";

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
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings)
      .then(
        (json) => { },
        () => console.log("failed to auth to this list")
      );
  }

  addRoleToList(listId: number, type: string): IPromise<ListRole> {
    const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?s=${secret}&type=${type}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeListRole);
  }

  deleteRoleFromList(listId: number, roleId: number): IPromise<ListRole> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?roleId=${roleId}`,
      method: "DELETE"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }
}

export const consumeListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = json.roleId;
  listRole.listId = json.listId;
  listRole.secret = json.secret;
  listRole.type = json.type;
  return listRole;
};
