import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';
import {
  consumeListRole,
  consumeListRoleUser,
  consumeLists
} from 'listlab-api/listSerialization';
import ListTask from 'listlab-api/ListTask';
import Payload from 'listlab-api/Payload';
import {consumeRecurrences} from 'listlab-api/TaskClient';
import {consumeTaskRole, consumeTaskRoleUser} from 'listlab-api/taskRoleSerialization';
import {consumeTaskParentOrders, consumeTasks} from 'listlab-api/taskSerialization';
import {consumeUsers} from 'listlab-api/userSerialization';

export const consumePayloadResult = (json: any): Payload => {
  const payload = new Payload();
  if (json.tasks) {
    payload.tasks = consumeTasks(json.tasks);
  }
  if (json.listTasks) {
    const listTasks: ListTask[] = [];
    for (const lt of json.listTasks) {
      const listTask = new ListTask(lt.listId, lt.taskId);
      listTasks.push(listTask);
    }
    payload.listTasks = listTasks;
  }
  if (json.listRoles) {
    payload.listRoles = json.listRoles.map(consumeListRole);
  }
  if (json.listRoleUsers) {
    payload.listRoleUsers = json.listRoleUsers.map(consumeListRoleUser);
  }
  if (json.lists) {
    payload.lists = consumeLists(json.lists);
  }
  if (json.taskRoles) {
    payload.taskRoles = json.taskRoles.map(consumeTaskRole);
  }
  if (json.taskRoleUsers) {
    payload.taskRoleUsers = json.taskRoleUsers.map(consumeTaskRoleUser);
  }
  if (json.taskParentOrders) {
    payload.taskParentOrders = consumeTaskParentOrders(json.taskParentOrders);
  }
  if (json.taskRootOrder) {
    payload.taskRootOrder = CRDTOrderDoc.create<number>(
      json.taskRootOrder,
      (a: number, b: number) => a === b
    );
  }
  if (json.recurrences) {
    payload.recurrences = consumeRecurrences(json.recurrences);
  }
  if (json.users) {
    payload.users = consumeUsers(json.users);
  }
  return payload;
};
