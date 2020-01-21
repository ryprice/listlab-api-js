import Notification from 'listlab-api/Notification';

export const consumeNotification = (json: any): Notification => {
  const notification = new Notification();
  notification.notificationId = json.notificationId;
  notification.userId = json.userId;
  notification.data = json.data;
  notification.seen = json.seen;
  notification.type = json.type;
  return notification;
};

export const consumeNotifications = (json: any): Notification[] => {
  const notifications = new Array<Notification>();
  for (let i = 0; i < json.length; i++) {
    const entity = consumeNotification(json[i]);
    notifications.push(entity);
  }
  return notifications;
};
