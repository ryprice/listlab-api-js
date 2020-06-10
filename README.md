# listlab-api-js
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

await listClient.addTasksToList([buyMilk.taskId], groceryList.listId);
```

Production configuration should look like this:
```javascript
// Environment context
Env: 'prod'
RootDomain: 'listlab.io',

// Web addresses
AppAddress: 'https://app.listlab.io',
WebAddress: 'https://www.listlab.io',

// Microservice addresses
AuthServiceAddress: 'https://api.listlab.io/sts',
CommentServiceAddress: 'https://api.listlab.io/comments',
ListServiceAddress: 'https://api.listlab.io/lists',
NotificationServiceAddress: 'https://api.listlab.io/notifications',
TaskServiceAddress: 'https://api.listlab.io/tasks',
UserServiceAddress: 'https://api.listlab.io/users',

```

To build, `npm run build`.
To run unit tests, `npm run test`.