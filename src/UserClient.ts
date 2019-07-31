import axios from 'axios';
import * as qs from 'qs';

import authorizedRequest, {authorizedRequestRaw} from 'ququmber-api/authorizedRequest';
import AuthSession from 'ququmber-api/AuthSession';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';
import User from 'ququmber-api/User';
import UserDetails from 'ququmber-api/UserDetails';

export default class UserClient {

  private config: QuqumberApiConfig;
  private userServiceAddress: string;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
    this.userServiceAddress = config.UserServiceAddress;
  }

  async getDetails(): Promise<AuthSession> {
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
    const entity = consumeUser(json[i]);
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
  userDetails.pendingEmail = json.pendingEmail;
  userDetails.isAnonymous = json.isAnonymous;
  return userDetails;
};
