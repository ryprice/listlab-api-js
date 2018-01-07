import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import Notification from "./Notification";
import TaskApiConfig from "./TaskApiConfig";

export default class NotificationClient {
  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
    this.config = config;
  }

  getNotifications(): IPromise<Notification[]> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) =>
      this.consumeNotifications(json)
    );
  }

  markSeen(notificationId: number): IPromise<Notification[]> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}/seen?notificationId=${notificationId}`,
      method: "PUT"
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  consumeNotification(json: any): Notification {
    const notification = new Notification();
    notification.notificationId = json.notificationId;
    notification.userId = json.userId;
    notification.data = json.data;
    notification.seen = json.seen;
    notification.type = json.type;
    return notification;
  }

  consumeNotifications(json: any): Notification[] {
    const notifications = new Array<Notification>();
    for (let i = 0; i < json.length; i++) {
      const entity = this.consumeNotification(json[i]);
      notifications.push(entity);
    }
    return notifications;
  }
}
