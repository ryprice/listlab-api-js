import {
  restJsonToListRole,
  restJsonToListRoleUser,
  restJsonToLists
} from 'listlab-api/listSerialization';
import ListTask from 'listlab-api/ListTask';
import Payload from 'listlab-api/Payload';
import {restJsonToTaskCreationGroup} from 'listlab-api/taskCreationGroupSerialization';
import {restJsonToTaskRole, restJsonToTaskRoleUser} from 'listlab-api/taskRoleSerialization';
import {restJsonToTaskDueOrders, restJsonToTaskParentOrders, restJsonToTasks} from 'listlab-api/taskSerialization';
import {restJsonToUsers} from 'listlab-api/userSerialization';

export const restJsonToPayloadResult = (json: any): Payload => {
  const payload = new Payload();
  if (json.tasks) {
    payload.tasks = restJsonToTasks(json.tasks);
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
    payload.listRoles = json.listRoles.map(restJsonToListRole);
  }
  if (json.listRoleUsers) {
    payload.listRoleUsers = json.listRoleUsers.map(restJsonToListRoleUser);
  }
  if (json.lists) {
    payload.lists = restJsonToLists(json.lists);
  }
  if (json.taskRoles) {
    payload.taskRoles = json.taskRoles.map(restJsonToTaskRole);
  }
  if (json.taskRoleUsers) {
    payload.taskRoleUsers = json.taskRoleUsers.map(restJsonToTaskRoleUser);
  }
  if (json.taskParentOrders) {
    payload.taskParentOrders = restJsonToTaskParentOrders(json.taskParentOrders);
  }
  if (json.taskDueOrders) {
    payload.taskDueOrders = restJsonToTaskDueOrders(json.taskDueOrders);
  }
  if (json.users) {
    payload.users = restJsonToUsers(json.users);
  }
  if (json.taskCreationGroups) {
    payload.taskCreationGroups = json.taskCreationGroups.map(restJsonToTaskCreationGroup);
  }
  return payload;
};
