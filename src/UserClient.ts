import {IPromise, Promise, resolve} from "q";

import authorizedRequest, {authorizedRequestRaw} from "./authorizedRequest";
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

  getDetails(): IPromise<AuthSession> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/details`,
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

  isUsernameTaken(username: string): IPromise<boolean> {
    return Promise((resolve, reject) => {
      const ajaxSettings = {
        url: `${this.userServiceAddress}/byUsername/${username}`,
        method: "GET"
      };
      return authorizedRequestRaw(this.config, ajaxSettings).then(
        () => resolve(true),
        ({response}) => {
          if (response.status === 404) resolve(false);
          else throw reject(response);
        }
      );
    });
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
  user.username = json.username;
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
  const userDetails = new AuthSession();
  userDetails.userId = json.userId;
  userDetails.name = json.name;
  userDetails.email = json.email;
  userDetails.settings = json.settings;
  userDetails.facebookId = json.facebookId;
  userDetails.googleId = json.googleId;
  userDetails.username = json.username;
  return userDetails;
};
