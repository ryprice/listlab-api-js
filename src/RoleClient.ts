import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import TaskApiConfig from "./TaskApiConfig";

export default class RoleClient {

    private roleServiceAddress: string;

    private config: TaskApiConfig;

    constructor(config: TaskApiConfig) {
        this.config = config;
        this.roleServiceAddress = config.TaskServiceAddress + "/role";
    }

    postListRole(listId: number, secret: string): IPromise<void> {
        const ajaxSettings = {
            url: `${this.roleServiceAddress}/list/${listId}?s=${secret}`,
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings)
            .then(
                (json) => { },
                () => console.log("failed to auth to this list")
            );
    }
}
