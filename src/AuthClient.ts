import axios from 'axios';
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
    return this.getCookie('todoAuthToken');
  }

  public logout() {
    this.removeCookie('todoAuthToken');
    window.location.href = `${this.config.WebAddress}`;
  }

  public async authWithFake(userId: number) {
    const ajaxSettings = {
      url: this.authServiceAddress + '/fake',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({userId: userId})
    };
    return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
  }

  public async authWithGoogleIdToken(googleIdToken: string) {
    if (googleIdToken !== null) {
      const ajaxSettings = {
        url: `${this.authServiceAddress}/google`,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({idToken: googleIdToken}),
      };
      return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
    }
  }

  public async authWithFacebookAccessToken(fbAccessToken: string) {
    if (fbAccessToken != null) {
      const ajaxSettings = {
        url: `${this.authServiceAddress}/facebook`,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({accessToken: fbAccessToken})
      };
      return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
    }
  }

  public async authWithAnonymous() {
    const ajaxSettings = {
      url: `${this.authServiceAddress}/anonymous`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
  }

  public async authWithAnonActor() {
    const ajaxSettings = {
      url: `${this.authServiceAddress}/anon-actor`,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };
    return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
  }

  public async fetchToken() {
    const ajaxSettings = {
      url: `${this.authServiceAddress}/token`,
      headers: {
        Authorization: `${this.getAuthToken()}`,
      },
      method: 'GET',
    };
    return axios(ajaxSettings).then((response: any) => this.parseAuthResult(response));
  }

  private parseAuthResult(response: any) {
    const token = response.data.token;
    this.setCookie('todoAuthToken', token);
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
