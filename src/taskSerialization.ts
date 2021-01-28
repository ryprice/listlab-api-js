import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';
import {
  restJsonToFuzzyTime,
  fuzzyTimeToRestJson
} from 'listlab-api/fuzzyTime/fuzzyTimeSerialization';
import Task from 'listlab-api/Task';
import TaskDueOrderTuple from 'listlab-api/TaskDueOrderTuple';
import TaskParentOrderTuple from 'listlab-api/TaskParentOrderTuple';
import {
  actorToRestJson,
  restJsonToMaybeUser,
  maybeUserToRestJson,
  restJsonToActor
} from 'listlab-api/userSerialization';
import {
  restParseInt,
  restParseString,
  restParseBool,
  restParseDate
} from 'listlab-api/utils/restParamParsers';

export const taskToRestJson = (task: Task): Object => {
  return {
    taskId: task.taskId,
    name: task.name,
    due: fuzzyTimeToRestJson(task.due),
    owner: maybeUserToRestJson(task.owner),
    parentId: task.parentId,
    completed: task.completed,
    seen: task.seen,
    recurrenceId: task.recurrenceId,
    creationTime: task.creationTime ? task.creationTime.toUTCString() : null,
    completionTime: task.completionTime ? task.completionTime.toUTCString() : null,
    readRole: task.readRole,
    writeRole: task.writeRole,
    author: actorToRestJson(task.author),
    inbox: task.inbox,
    taskCreationGroupId: task.taskCreationGroupId,
  };
};

export const restJsonToTasks = (json: any): Task[] => {
  const tasks = new Array<Task>();
  for (let i = 0; i < json.length; i++) {
    const entity = restJsonToTask(json[i]);
    tasks.push(entity);
  }
  return tasks;
};

export const restJsonToTask = (json: any) => {
  const task = new Task();
  task.taskId = restParseInt(json.taskId);
  task.name = restParseString(json.name);
  task.owner = restJsonToMaybeUser(json.owner);
  task.completed = restParseBool(json.completed);
  task.parentId = restParseInt(json.parentId);
  task.childCount = json.childCount ? restParseInt(json.childCount) : 0;
  task.incompleteChildCount = json.incompleteChildCount ? restParseInt(json.incompleteChildCount) : 0;
  task.isShared = restParseBool(json.isShared);
  task.seen = restParseBool(json.seen);
  task.recurrenceId = restParseInt(json.recurrenceId);
  task.creationTime = restParseDate(json.creationTime);
  task.completionTime = restParseDate(json.completionTime);
  task.readRole = restParseInt(json.readRole);
  task.writeRole = restParseInt(json.writeRole);
  task.author = restJsonToActor(json.author);
  task.canRead = restParseBool(json.canRead);
  task.canWrite = restParseBool(json.canWrite);
  task.inbox = restParseBool(json.inbox);
  if (json.due) {
    task.due = restJsonToFuzzyTime(json.due);
  }
  task.taskCreationGroupId = restParseInt(json.taskCreationGroupId);
  return task;
};

export const restJsonToTaskParentOrders = (json: any): TaskParentOrderTuple[] => {
  const tuples = new Array<TaskParentOrderTuple>();
  for (let i = 0; i < json.length; i++) {
    tuples.push({
      taskId: json[i].taskId,
      doc: CRDTOrderDoc.create<number>(json[i].doc, (a,b) => a === b)
    });
  }
  return tuples;
};

export const restJsonToTaskDueOrders = (json: any): TaskDueOrderTuple[] => {
  const tuples = new Array<TaskDueOrderTuple>();
  for (let i = 0; i < json.length; i++) {
    tuples.push({
      due: restJsonToFuzzyTime(json[i].due),
      userId: 0,
      doc: CRDTOrderDoc.create<number>(json[i].doc, (a,b) => a === b)
    });
  }
  return tuples;
};