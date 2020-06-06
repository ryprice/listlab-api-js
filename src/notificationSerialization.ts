import Notification from 'listlab-api/Notification';
import {restParseInt, restParseBool, restParseString} from './utils/restParamParsers';

export const restJsonToNotification = (json: any): Notification => {
  const notification = new Notification();
  notification.notificationId = restParseInt(json.notificationId);
  notification.userId = restParseInt(json.userId);
  notification.data = json.data;
  notification.seen = restParseBool(json.seen);
  notification.type = restParseString(json.type);
  return notification;
};

export const restJsonToNotifications = (json: any): Notification[] => {
  const notifications = new Array<Notification>();
  for (let i = 0; i < json.length; i++) {
    const entity = restJsonToNotification(json[i]);
    notifications.push(entity);
  }
  return notifications;
};
