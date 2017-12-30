import {IPromise, resolve} from "q";
import * as qs from 'qs';

import {authorizedRequest} from "./authorizedRequest";
import FuzzyGranularity from "./FuzzyGranularity";
import FuzzyTime from "./FuzzyTime";
import {consumePayloadResult} from "./InitClient";
import Payload from "./Payload";
import Recurrence from "./Recurrence";
import RecurrenceSchedule from "./RecurrenceSchedule";
import Task from "./Task";
import {TaskApiConfig} from "./TaskApiConfig";

export class TaskClient {

    private config: TaskApiConfig;

    private taskServiceAddress: string;

    constructor(config: TaskApiConfig) {
        this.taskServiceAddress = config.TaskServiceAddress;
        this.config = config;
    }

    public getTask(id: number): IPromise<Payload> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/task/${id}`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json) => {
            return consumePayloadResult(json);
        });
    }

    getTasks(): IPromise<Task[]> {
        const ajaxSettings = {
            url: this.taskServiceAddress,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            return consumeTasks(json);
        });
    }

    search(query: string): IPromise<Task[]> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/search?q=${query}`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            return consumeTasks(json);
        });
    }

    getTaskChildren(taskId: number): IPromise<Task[]> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/task/${taskId}/children`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => { return consumeTasks(json); });
    }

    getTasksInProgress(): IPromise<Task[]> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/tasks/inprogress`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => { return consumePayloadResult(json).tasks; });
    }

    getTasksInRange(from: FuzzyTime, to: FuzzyTime, limit: number): IPromise<Task[]> {
        const data: any = {};
        if (from) {
            data.from = from.getTime().toISOString();
        }
        if (to) {
            data.to = to.getTime().toISOString();
        }
        if (limit) {
            data.limit = limit;
        }

        const ajaxSettings = {
            url: `${this.taskServiceAddress}/tasks?${qs.stringify(data)}`,
            method: "GET"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            const payload = consumePayloadResult(json);
            return payload.tasks;
        });
    }

    postTask(task: Task): IPromise<Task[]> {
        const ajaxSettings: any = {
            url: `${this.taskServiceAddress}/task`,
            data: JSON.stringify(this.generateJson(task)),
            headers: {"Content-Type": "application/json"},
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
            return consumePayloadResult(json).tasks;
        });
    }

    postRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
        const ajaxSettings: any = {
            url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
            data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
            headers: {"Content-Type": "application/json"},
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings).then(() => recurrence);
    }

    putRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
        const ajaxSettings: any = {
            url: `${this.taskServiceAddress}/recurrence`,
            data: JSON.stringify(this.generateRecurrenceJson(recurrence)),
            headers: {"Content-Type": "application/json"},
            method: "PUT"
        };
        return authorizedRequest(this.config, ajaxSettings).then(() => recurrence);
    }

    deleteRecurrence(recurrence: Recurrence): IPromise<Recurrence> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/recurrence/${recurrence.recurrenceId}`,
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        };
        return authorizedRequest(this.config, ajaxSettings);
    }

    putTask(task: Task): IPromise<Payload> {
        const ajaxSettings: any = {
            url: `${this.taskServiceAddress}/task`,
            data: JSON.stringify(this.generateJson(task)),
            headers: {"Content-Type": "application/json"},
            method: "PUT"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json: any) =>
            consumePayloadResult(json)
        );
    }

    putTasks(tasks: Task[]): void {
        for (const task of tasks) {
            this.putTask(task);
        }
    }

    moveTaskBefore(taskId: number, beforeId: number): IPromise<Payload> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/tasks/move?taskId=${taskId}&before=${beforeId}`,
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json) => {
            return consumePayloadResult(json);
        });
    }

    moveTaskAfter(taskId: number, afterId: number): IPromise<Payload> {
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/tasks/move?taskId=${taskId}&after=${afterId}`,
            method: "POST"
        };
        return authorizedRequest(this.config, ajaxSettings).then((json) => {
            return consumePayloadResult(json);
        });
    }

    deleteTasks(tasks: Task[]): IPromise<Task[]> {
        const idsQuery = qs.stringify({id: tasks.map((t) => t.taskId)}, {arrayFormat: 'repeat'});
        const ajaxSettings = {
            url: `${this.taskServiceAddress}/tasks?${idsQuery}`,
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        };
        return authorizedRequest(this.config, ajaxSettings).then(() => tasks);
    }

    getParent(task: Task): IPromise<Payload> {
        if (task.parentId > 0) {
            return this.getTask(task.parentId);
        }
        return resolve(null);
    }

    generateJson(task: Task): Object {
        return {
            taskId: task.taskId,
            name: task.name,
            due: this.generateFuzzyTimeJson(task.due),
            userId: task.userId,
            parentId: task.parentId,
            completed: task.completed,
            dueOrder: task.dueOrder,
            seen: task.seen,
            recurrenceId: task.recurrenceId,
            creationTime: task.creationTime,
            completionTime: task.completionTime
        };
    }

    generateRecurrenceJson(recurrence: Recurrence): Object {
        return {
            recurrenceId: recurrence.recurrenceId,
            baseTaskId: recurrence.baseTaskId,
            from: this.generateFuzzyTimeJson(recurrence.schedule.from),
            to: this.generateFuzzyTimeJson(recurrence.schedule.to),
            period: recurrence.schedule.period.getName(),
            selected: recurrence.schedule.selected
        };
    }

    generateFuzzyTimeJson(fuzzyTime: FuzzyTime): Object {
        return {
            time: fuzzyTime.getTime(),
            granularity: fuzzyTime.getGranularity().getName()
        };
    }
}

export const consumeTasks = (json: any[]): Task[] => {
    const tasks = new Array<Task>();
    for (let i = 0; i < json.length; i++) {
        const entity = this.consumeTask(json[i]);
        tasks.push(entity);
    }
    return tasks;
};

export const consumeTask = (json: any) => {
    const task = new Task();
    task.taskId = json.taskId;
    task.name = json.name;
    task.userId = json.userId;
    task.completed = json.completed;
    task.parentId = json.parentId;
    task.childCount = json.childCount ? json.childCount : 0;
    task.incompleteChildCount = json.incompleteChildCount ? json.incompleteChildCount : 0;
    task.dueOrder = json.dueOrder;
    task.seen = json.seen;
    task.recurrenceId = json.recurrenceId;
    task.creationTime = json.creationTime && new Date(json.creationTime);
    task.completionTime = json.completionTime && new Date(json.completionTime);
    if (json.due) {
        task.due = consumeFuzzyTime(json.due);
    }
    return task;
};

export const consumeFuzzyTime = (json: any) => {
    return new FuzzyTime(
        new Date(json.time),
        consumeFuzzyGranularity(json.granularity)
    );
};

export const consumeFuzzyGranularity = (json: any) => {
    switch(json.toLowerCase()) {
        case "minute": return FuzzyGranularity.MINUTE;
        case "hour": return FuzzyGranularity.HOUR;
        case "day": return FuzzyGranularity.DAY;
        case "week": return FuzzyGranularity.WEEK;
        case "month": return FuzzyGranularity.MONTH;
        case "year": return FuzzyGranularity.YEAR;
        case "forever": return FuzzyGranularity.FOREVER;
        default: throw "Error in consumeTasks granularity unknown";
    }
};

export const consumeRecurrence = (json: any) => {
    const recurrence = new Recurrence();
    recurrence.recurrenceId = json.recurrenceId;
    recurrence.baseTaskId = json.baseTaskId;
    const schedule = new RecurrenceSchedule();
    schedule.to = consumeFuzzyTime(json.to);
    schedule.from = consumeFuzzyTime(json.from);
    schedule.period = consumeFuzzyGranularity(json.period);
    schedule.selected = json.selected;
    recurrence.schedule = schedule;
    return recurrence;
};

export const consumeRecurrences = (json: any[]): Recurrence[] => {
    const recurrences = new Array<Recurrence>();
    for (let i = 0; i < json.length; i++) {
        const entity = this.consumeRecurrence(json[i]);
        recurrences.push(entity);
    }
    return recurrences;
};
