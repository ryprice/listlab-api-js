import axios, {AxiosRequestConfig} from 'axios';
import * as qs from 'qs';

import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import ListLabSession from 'listlab-api/ListLabSession';

export default class AuthClient {

  private readonly authServiceAddress: string;

  private readonly config: ListlabApiConfig;

  public constructor(config: ListlabApiConfig) {
    this.config = config;
    this.authServiceAddress = config.AuthServiceAddress;
    if (this.isAuthenticated()) {
      config.AuthToken = this.getAuthToken();
    }
  }

  public isAuthenticated() {
    return this.getAuthToken() ? true : false;
  }

  public getAuthToken() {
    return this.getCookie(this.getCookieKey());
  }

  public logout() {
    this.removeCookie(this.getCookieKey());
    window.location.href = `${this.config.WebAddress}`;
  }

  public async authWithFake(userId: number) {
    const ajaxSettings: AxiosRequestConfig = {
      url: this.authServiceAddress + '/fake',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({userId: userId})
    };
    const response = await axios(ajaxSettings);
    return this.parseAuthResult(response);
  }

  public async authWithGoogleIdToken(googleIdToken: string) {
    if (googleIdToken !== null) {
      const ajaxSettings: AxiosRequestConfig = {
        url: `${this.authServiceAddress}/google`,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({idToken: googleIdToken}),
      };
      const response = await axios(ajaxSettings);
      return this.parseAuthResult(response);
    }
  }

  public async authWithFacebookAccessToken(fbAccessToken: string) {
    if (fbAccessToken != null) {
      const ajaxSettings: AxiosRequestConfig = {
        url: `${this.authServiceAddress}/facebook`,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({accessToken: fbAccessToken})
      };
      const response = await axios(ajaxSettings);
      return this.parseAuthResult(response);
    }
  }

  public async authWithAnonActor() {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.authServiceAddress}/anon-actor`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    const response = await axios(ajaxSettings);
    return this.parseAuthResult(response);
  }

  public async awaitAnyToken() {
    if (!this.isAuthenticated()) {
      await this.authWithAnonActor();
    } else {
      try {
        await this.fetchToken();
      } catch {
        await this.authWithAnonActor();
      }
    }
  }

  public async fetchToken() {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.authServiceAddress}/token`,
      headers: {
        Authorization: `${this.getAuthToken()}`,
      },
      method: 'GET',
    };
    const response = await axios(ajaxSettings);
    return this.parseAuthResult(response);
  }

  private getCookieKey() {
    return `listlabToken${this.config.Env === 'local' ? 'Local' : ''}`;
  }

  private parseAuthResult(response: any) {
    const token = response.data.token;
    this.setCookie(this.getCookieKey(), token);
    if (token) {
      this.config.AuthToken = token;
    }
    const tokenObj = new ListLabSession();
    tokenObj.token = token;
    tokenObj.userId = response.data.userId;
    tokenObj.actorId = response.data.actorId;
    return tokenObj;
  }

  private getCookie(key: string) {
    const arrCookies = document.cookie.split(';');
    for (let i = 0; i < arrCookies.length; i++) {
      let curKey = arrCookies[i].substr(0, arrCookies[i].indexOf('='));
      const curVal = arrCookies[i].substr(arrCookies[i].indexOf('=') + 1);
      curKey = curKey.replace(/^\s+|\s+$/g, '');
      if (curKey === key) {
        return decodeURIComponent(curVal);
      }
    }
  }

  private setCookie(key: string, val: string) {
    document.cookie = key + '=' + encodeURIComponent(val) + ';path=/;domain=.' + this.config.RootDomain;
  }

  private removeCookie(key: string) {
    document.cookie = key + '=' + ';path=/;domain=.' + this.config.RootDomain;
  }
}
