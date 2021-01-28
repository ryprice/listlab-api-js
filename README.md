# listlab-api-js
TypeScript and JS client library for building apps on ListLab services. Library includes:
- HTTP clients for all public REST endpoints
- ListLab data models
- Serialization/deserialization methods for data models
- FuzzyTime - special date/time models for representing non-specific dates

Sample usage to create a task and list:
```javascript
const authClient = new AuthClient(config);
const taskClient = new TaskClient(config);
await authClient.awaitAnyToken(); // Retrieves anonymous token

await taskClient.precreateTasks(); // Prefetches some new tasks with IDs
let buyMilk = taskClient.getPreTask();
buyMilk.name = 'buy milk';
buyMilk = await taskClient.sendMutations([{
  type: TaskMutationTypes.UPDATE_TASK_PROPS,
  params: {
    tasks: [buyMilk]
  }
 }]);

let groceryList = new List();
groceryList.name = 'grocery list';
groceryList = await listClient.postList(groceryList);

await taskClient.sendMutations([{
  type: TaskMutationTypes.ADD_LIST_TASK,
  params: {
    taskIds: [buyMilk.taskId],
    listId: groceryList.listId
  }
}]);
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
