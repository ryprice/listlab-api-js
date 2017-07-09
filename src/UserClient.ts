import {IPromise} from "q";

import {authorizedRequest} from "./authorizedRequest";
import AuthSession from "./AuthSession";
import {TaskApiConfig} from "./TaskApiConfig";
import User from "./User";

export class UserClient {

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
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            return this.consumeMe(json);
        });
    }

    search(q: string): IPromise<User[]> {
        const ajaxSettings = {
            url: `${this.userServiceAddress}/search?q=${q}`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            return this.consumeUsers(json);
        });
    }

    postSettings(settings: {[key: string]: string}): IPromise<void> {
        const ajaxSettings = {
            url: `${this.userServiceAddress}/settings`,
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings).then(() => {return;});
    }

    consumeUser(json: any): User {
        const user = new User();
        user.userId = json.userId;
        user.name = json.name;
        user.email = json.email;
        return user;
    }

    consumeUsers(json: any): User[] {
        const users = new Array<User>();
        for (let i = 0; i < json.length; i++) {
            const entity = this.consumeUser(json[i]);
            users.push(entity);
        }
        return users;
    }

    consumeMe(json: any): AuthSession {
        const me = new AuthSession();
        me.userId = json.userId;
        me.name = json.name;
        me.email = json.email;
        me.settings = json.settings;
        return me;
    }
}
