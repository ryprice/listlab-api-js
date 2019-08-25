import authorizedRequest from 'ququmber-api/authorizedRequest';
import Notification from 'ququmber-api/Notification';
import {consumeNotifications} from 'ququmber-api/notificationSerialization';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export default class NotificationClient {
  private readonly config: QuqumberApiConfig;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
  }

  async getNotifications(): Promise<Notification[]> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeNotifications(json);
  }

  async markSeen(notificationId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.config.NotificationServiceAddress}/seen?notificationId=${notificationId}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}
