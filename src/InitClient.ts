import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import {consumeLists} from "./ListClient";
import ListTask from "./ListTask";
import Payload from "./Payload";
import TaskApiConfig from "./TaskApiConfig";
import {consumeRecurrences, consumeTasks} from "./TaskClient";

export default class InitClient {

    private initServiceAddress: string;

    private config: TaskApiConfig;

    constructor(config: TaskApiConfig) {
        this.config = config;
        this.initServiceAddress = `${config.TaskServiceAddress}/todoweb`;
    }

    public init(): IPromise<Payload> {
        const ajaxSettings = {
            url: `${this.initServiceAddress}/init`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json) => consumePayloadResult(json));
    }
}

export const consumePayloadResult = (json: any): Payload => {
    const payload = new Payload();
    if (json.tasks) {
        payload.tasks = consumeTasks(json.tasks);
    }
    if (json.listTasks) {
        const listTasks: ListTask[] = [];
        for (const lt of json.listTasks) {
            const listTask = new ListTask(lt.listId, lt.taskId);
            listTasks.push(listTask);
        }
        payload.listTasks = listTasks;
    }
    if (json.lists) {
        payload.lists = consumeLists(json.lists);
    }
    if (json.recurrences) {
        payload.recurrences = consumeRecurrences(json.recurrences);
    }
    return payload;
};
