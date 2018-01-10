import {IPromise, resolve} from "q";

import authorizedRequest from "./authorizedRequest";
import AuthSession from "./AuthSession";
import TaskApiConfig from "./TaskApiConfig";
import User from "./User";
import UserDetails from "./UserDetails";

export default class UserClient {

  private config: TaskApiConfig;
  private userServiceAddress: string;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.userServiceAddress = config.UserServiceAddress;
  }

  getMe(): IPromise<AuthSession> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/me`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeUserDetails);
  }

  search(q: string): IPromise<User[]> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/search?q=${q}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeUsers);
  }

  getUsersById(ids: number[]): IPromise<User[]> {
    if (ids.length < 1) return resolve([]);
    const ajaxSettings = {
      url: `${this.userServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeUsers);
  }

  postSettings(settings: {[key: string]: string}): IPromise<void> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/settings`,
      method: "POST",
      data: JSON.stringify(settings),
      headers: {"Content-Type": "application/json"},
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => { });
  }

  postUserDetails(user: UserDetails): IPromise<void> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}`,
      method: "POST",
      data: JSON.stringify(user),
      headers: {"Content-Type": "application/json"},
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => { });
  }
}


export const consumeUser = (json: any): User => {
  const user = new User();
  user.userId = json.userId;
  user.name = json.name;
  return user;
};

export const consumeUsers = (json: any): User[] => {
  const users = new Array<User>();
  for (let i = 0; i < json.length; i++) {
    const entity = this.consumeUser(json[i]);
    users.push(entity);
  }
  return users;
};

export const consumeUserDetails = (json: any): AuthSession => {
  const me = new AuthSession();
  me.userId = json.userId;
  me.name = json.name;
  me.email = json.email;
  me.settings = json.settings;
  return me;
};
