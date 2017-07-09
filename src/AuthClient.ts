import * as axios from "axios";
import {IPromise} from "q";
import * as qs from "qs";

import {TaskApiConfig} from "./TaskApiConfig";

export class AuthClient {

    private authServiceAddress: string;
    private config: TaskApiConfig;

    public constructor(config: TaskApiConfig) {
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
        return this.getCookie("todoAuthToken");
    }

    public logout() {
        this.removeCookie("todoAuthToken");
        window.location.href = `${this.config.WebAddress}`;
    }

    public authWithFake(userId: number): IPromise<void> {
        const ajaxSettings = {
            url: this.authServiceAddress + "/fake",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify({userId: userId})
        };
        return axios(ajaxSettings).then(response => {
            this.parseAuthResult(response);
        });
    }

    public authWithGoogleIdToken(googleIdToken: string): IPromise<void> {
        if (googleIdToken !== null) {
            const ajaxSettings = {
                url: `${this.authServiceAddress}/google`,
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                data: qs.stringify({idToken: googleIdToken}),
            };
            return axios(ajaxSettings).then(response => {
                this.parseAuthResult(response);
            });
        }
    }

    public authWithFacebookAccessToken(fbAccessToken: string): IPromise<any> {
        if (fbAccessToken != null) {
            const ajaxSettings = {
                url: `${this.authServiceAddress}/facebook`,
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                data: qs.stringify({accessToken: fbAccessToken})
            };
            return axios(ajaxSettings).then(response => {
                this.parseAuthResult(response);
            });
        }
    }

    public authWithAnonymous(): IPromise<void> {
        const ajaxSettings = {
            url: `${this.authServiceAddress}/anonymous`,
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        };
        return axios(ajaxSettings).then(response => {
            this.parseAuthResult(response);
        });
    }

    private parseAuthResult(response: any) {
        const token = response.data.token;
        this.setCookie("todoAuthToken", token);
        if (token) {
            this.config.AuthToken = token;
            console.log("Auth token is: " + token);
        }
    }

    private getCookie(key: string) {
        const arrCookies = document.cookie.split(";");
        for (let i = 0; i < arrCookies.length; i++) {
            let curKey = arrCookies[i].substr(0, arrCookies[i].indexOf("="));
            const curVal = arrCookies[i].substr(arrCookies[i].indexOf("=") + 1);
            curKey = curKey.replace(/^\s+|\s+$/g, "");
            if (curKey === key) {
                return decodeURIComponent(curVal);
            }
        }
    }

    private setCookie(key: string, val: string) {
        document.cookie = key + "=" + encodeURIComponent(val) + ";path=/;domain=." + this.config.RootDomain;
    }

    private removeCookie(key: string) {
        document.cookie = key + "=" + ";path=/;domain=." + this.config.RootDomain;
    }
}
