import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import TaskApiConfig from "./TaskApiConfig";

export default class RoleClient {

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
