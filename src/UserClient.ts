import axios from 'axios';
import * as qs from 'qs';

import authorizedRequest, {authorizedRequestRaw} from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import User from 'listlab-api/User';
import UserDetails from 'listlab-api/UserDetails';
import {consumeUserDetails, consumeUsers} from 'listlab-api/userSerialization';

export default class UserClient {

  private readonly config: ListlabApiConfig;

  private readonly userServiceAddress: string;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.userServiceAddress = config.UserServiceAddress;
  }

  async getDetails(): Promise<UserDetails> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/details`,
      method: 'GET',
      headers: {
        Authorization: this.config.AuthToken
      }
    };
    const response = await axios(ajaxSettings);
    return consumeUserDetails(response.data);
  }

  async search(q: string): Promise<User[]> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/search?q=${q}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeUsers(json);
  }

  async getUsersById(ids: number[]): Promise<User[]> {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings = {
      url: `${this.userServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeUsers(json);
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const ajaxSettings = {
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
    const ajaxSettings = {
      url: `${this.userServiceAddress}/settings`,
      method: 'PUT',
      data: JSON.stringify(settings),
      headers: {'Content-Type': 'application/json'},
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async putUserDetails(user: UserDetails): Promise<void> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}`,
      method: 'PUT',
      data: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'},
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async anonMergeFacebook(accessToken: string): Promise<void> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/anon-merge/facebook`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({accessToken})
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async anonMergeGoogle(accessToken: string): Promise<void> {
    const ajaxSettings = {
      url: `${this.userServiceAddress}/anon-merge/google`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({accessToken})
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}
