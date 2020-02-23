import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';
import {
  consumeFuzzyTime,
  generateFuzzyTimeJson
} from 'listlab-api/fuzzyTimeSerialization';
import Task from 'listlab-api/Task';
import TaskParentOrderTuple from 'listlab-api/TaskParentOrderTuple';
import {consumeMaybeUser, generateMaybeUserJson} from 'listlab-api/userSerialization';

export const generateTaskJson = (task: Task): Object => {
  return {
    taskId: task.taskId,
    name: task.name,
    due: generateFuzzyTimeJson(task.due),
    owner: generateMaybeUserJson(task.owner),
    parentId: task.parentId,
    completed: task.completed,
    dueOrder: task.dueOrder,
    seen: task.seen,
    recurrenceId: task.recurrenceId,
    creationTime: task.creationTime,
    completionTime: task.completionTime,
    readRole: task.readRole,
    writeRole: task.writeRole,
    author: task.author,
  };
};

export const consumeTasks = (json: any): Task[] => {
  const tasks = new Array<Task>();
  for (let i = 0; i < json.length; i++) {
    const entity = consumeTask(json[i]);
    tasks.push(entity);
  }
  return tasks;
};

export const consumeTask = (json: any) => {
  const task = new Task();
  task.taskId = json.taskId;
  task.name = json.name;
  task.owner = consumeMaybeUser(json.owner);
  task.completed = json.completed;
  task.parentId = json.parentId;
  task.childCount = json.childCount ? json.childCount : 0;
  task.incompleteChildCount = json.incompleteChildCount ? json.incompleteChildCount : 0;
  task.isShared = json.isShared;
  task.dueOrder = json.dueOrder;
  task.seen = json.seen;
  task.recurrenceId = json.recurrenceId;
  task.creationTime = json.creationTime && new Date(json.creationTime);
  task.completionTime = json.completionTime && new Date(json.completionTime);
  task.readRole = json.readRole;
  task.writeRole = json.writeRole;
  task.author = json.author;
  task.canRead = json.canRead;
  task.canWrite = json.canWrite;
  if (json.due) {
    task.due = consumeFuzzyTime(json.due);
  }
  return task;
};

export const consumeTaskParentOrders = (json: any): TaskParentOrderTuple[] => {
  const tuples = new Array<TaskParentOrderTuple>();
  for (let i = 0; i < json.length; i++) {
    tuples.push({
      taskId: json[i].taskId,
      doc: CRDTOrderDoc.create<number>(json[i].doc, (a,b) => a === b)
    });
  }
  return tuples;
};