import authorizedRequest from 'ququmber-api/authorizedRequest';
import Notification from 'ququmber-api/Notification';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export default class NotificationClient {
  private config: QuqumberApiConfig;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
  }

  async getNotifications(): Promise<Notification[]> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return this.consumeNotifications(json);
  }

  async markSeen(notificationId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}/seen?notificationId=${notificationId}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
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
