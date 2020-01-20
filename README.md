# ququmber-api-js
JavaScript client library for all ListLab REST endpoints and ListLab data models.

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
RootDomain: 'listlab.io',

// Web addresses
AppAddress: 'http://app.listlab.io',
WebAddress: 'http://www.listlab.io',

// Microservice addresses
AuthServiceAddress: 'http://api.listlab.io/sts',
CommentServiceAddress: 'http://api.listlab.io/comments',
ListServiceAddress: 'http://api.listlab.io/lists',
NotificationServiceAddress: 'http://api.listlab.io/notifications',
TaskServiceAddress: 'http://api.listlab.io/tasks',
UserServiceAddress: 'http://api.listlab.io/users',

```
