import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import Notification from 'listlab-api/Notification';
import {consumeNotifications} from 'listlab-api/notificationSerialization';

export default class NotificationClient {
  private readonly config: ListlabApiConfig;

  constructor(config: ListlabApiConfig) {
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
