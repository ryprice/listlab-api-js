import List from 'ququmber-api/List';
import ListRole from 'ququmber-api/ListRole';
import {consumeListRoleType} from 'ququmber-api/ListRoleType';
import ListRoleUser from 'ququmber-api/ListRoleUser';
import ListTask from 'ququmber-api/ListTask';
import Payload from 'ququmber-api/Payload';
import {consumeTasks} from 'ququmber-api/taskSerialization';

export const generateListJson = (list: List) => ({
  listId: list.listId,
  name: list.name,
  userId: list.userId,
  color: list.color,
  sortOrder: list.sortOrder,
  parentId: list.parentId,
  author: list.author,
  creationTime: list.creationTime,
});

export const consumeList = (json: any): List => {
  const list = new List();
  list.listId = json.listId;
  list.userId = json.userId;
  list.name = json.name;
  list.color = json.color;
  list.sortOrder = json.sortOrder;
  list.parentId = json.parentId;
  list.readRole = json.readRole;
  list.writeRole = json.writeRole;
  list.author = json.author;
  list.creationTime = json.creationTime && new Date(json.creationTime);
  if (json.tasks) {
    consumeListTasks(list.listId, json.tasks);
  }
  return list;
};

export const consumeLists = (json: any): List[] => {
  const lists = new Array<List>();
  for (let i = 0; i < json.length; i++) {
    const list = consumeList(json[i]);
    lists.push(list);
  }

  return lists;
};

export const consumeListTasks = (listId: number, json: any): Payload => {
  const payload = new Payload();
  payload.tasks = consumeTasks(json);
  payload.listTasks = [];
  for (const task of payload.tasks) {
    const listTask = new ListTask(listId, task.taskId);
    payload.listTasks.push(listTask);
  }
  return payload;
};

export const consumeListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = json.roleId;
  listRole.listId = json.listId;
  listRole.secret = json.secret;
  listRole.type = consumeListRoleType(json.type);
  return listRole;
};

export const consumeListRoleUser = (json: any): ListRoleUser => {
  const listRoleUser = new ListRoleUser(json.roleId, json.userId);
  return listRoleUser;
};

export const generateListRoleJson = (listRole: ListRole): Object => ({
  roleId: listRole.roleId,
  listId: listRole.listId,
  type: listRole.type,
  secret: listRole.secret
});
