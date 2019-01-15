# ququmber-api-js
JavaScript client library for all Ququmber REST endpoints and Ququmber data models.

Sample usage to create a task and list:
```javascript
const authClient = new AuthClient(config);
const taskClient = new TaskClient(config);
await authClient.authWithAnonymous();

let buyMilk = new Task();
buyMilk.name = 'buy milk';
buyMilk = await taskClient.postTask(buyMilk);

let groceryList = new List();
groceryList.name = 'grocery list';
groceryList = await listClient.postList(groceryList);

await listClient.addTaskToList(buyMilk.taskId, groceryList.listId);
```

Production configuration should look like this:
```javascript
// Environment context
Env: 'prod'
RootDomain: 'ququmber.com',

// Web addresses
AppAddress: 'http://app.ququmber.com',
WebAddress: 'http://www.ququmber.com',

// Microservice addresses
AuthServiceAddress: 'http://api.ququmber.com/sts',
CommentServiceAddress: 'http://api.ququmber.com/comments',
ListServiceAddress: 'http://api.ququmber.com/lists',
NotificationServiceAddress: 'http://api.ququmber.com/notifications',
TaskServiceAddress: 'http://api.ququmber.com/tasks',
UserServiceAddress: 'http://api.ququmber.com/users',

```
