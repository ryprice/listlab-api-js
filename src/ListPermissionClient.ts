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

  postListRole(listId: number, secret: string): IPromise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/role/${listId}?s=${secret}`,
      method: "POST"
    };
    return authorizedRequest(this.config, ajaxSettings)
      .then(
        (json) => { },
        () => console.log("failed to auth to this list")
      );
  }
}

export const consumeListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = json.roleId;
  listRole.secret = json.secret;
  listRole.type = json.type;
  return listRole;
};
