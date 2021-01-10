import axios, {AxiosRequestConfig} from 'axios';
import * as qs from 'qs';

import authorizedRequest, {authorizedRequestRaw} from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import SessionActor from 'listlab-api/SessionActor';
import User from 'listlab-api/User';
import UserDetails from 'listlab-api/UserDetails';
import {restJsonToSessionActor, restJsonToUsers} from 'listlab-api/userSerialization';

export type UserClientSearchParams = {
  taskId?: number;
};

export default class UserClient {

  private readonly config: ListlabApiConfig;

  private readonly userServiceAddress: string;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.userServiceAddress = config.UserServiceAddress;
  }

  async getSessionActor(): Promise<SessionActor> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/session-actor`,
      method: 'GET',
      headers: {
        Authorization: this.config.AuthToken
      }
    };
    const response = await axios(ajaxSettings);
    return restJsonToSessionActor(response.data);
  }

  async search(q: string, params: UserClientSearchParams = {}): Promise<User[]> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/search?${qs.stringify({
        ...params,
        ...(q ? {q} : {})
      })}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToUsers(json);
  }

  async getUsersById(ids: number[]): Promise<User[]> {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToUsers(json);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/byUsername/${username}`,
      method: 'GET'
    };
    try {
      await authorizedRequestRaw(this.config, ajaxSettings);
      return true;
    } catch ({response}) {
      if (response.status === 404) {
        return false;
      } else {
        throw response;
      }
    }
  }

  async putSettings(settings: {[key: string]: string}): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/settings`,
      method: 'PUT',
      data: JSON.stringify(settings),
      headers: {'Content-Type': 'application/json'},
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async putUserDetails(user: UserDetails): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}`,
      method: 'PUT',
      data: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'},
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async anonMergeFacebook(accessToken: string): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/anon-merge/facebook`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({accessToken})
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async anonMergeGoogle(accessToken: string): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.userServiceAddress}/anon-merge/google`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({accessToken})
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}
