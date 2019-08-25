import {
  consumeListRole,
  consumeListRoleUser,
  consumeLists
} from 'ququmber-api/listSerialization';
import ListTask from 'ququmber-api/ListTask';
import Payload from 'ququmber-api/Payload';
import {consumeRecurrences} from 'ququmber-api/TaskClient';
import {consumeTaskRole, consumeTaskRoleUser} from 'ququmber-api/taskRoleSerialization';
import {consumeTasks} from 'ququmber-api/taskSerialization';
import {consumeUsers} from 'ququmber-api/userSerialization';

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
  if (json.recurrences) {
    payload.recurrences = consumeRecurrences(json.recurrences);
  }
  if (json.users) {
    payload.users = consumeUsers(json.users);
  }
  return payload;
};
