import List from 'listlab-api/List';
import ListRole from 'listlab-api/ListRole';
import {restJsonToListRoleType} from 'listlab-api/ListRoleType';
import ListRoleUser from 'listlab-api/ListRoleUser';
import ListTask from 'listlab-api/ListTask';
import Payload from 'listlab-api/Payload';
import {restJsonToTasks} from 'listlab-api/taskSerialization';
import {restParseInt, restParseString, restParseDate, restParseBool} from 'listlab-api/utils/restParamParsers';

export const listToRestJson = (list: List) => ({
  listId: list.listId,
  name: list.name,
  userId: list.userId,
  color: list.color,
  sortOrder: list.sortOrder,
  parentId: list.parentId,
  author: list.author,
  creationTime: list.creationTime,
  archived: list.archived,
});

export const restJsonToList = (json: any): List => {
  const list = new List();
  list.listId = restParseInt(json.listId);
  list.userId = restParseInt(json.userId);
  list.name = restParseString(json.name);
  list.color = restParseString(json.color);
  list.sortOrder = restParseInt(json.sortOrder);
  list.parentId = restParseInt(json.parentId);
  list.readRole = restParseInt(json.readRole);
  list.writeRole = restParseInt(json.writeRole);
  list.author = restParseInt(json.author);
  list.creationTime = restParseDate(json.creationTime);
  list.archived = restParseBool(json.archived);
  if (json.tasks) {
    restJsonToListTasks(list.listId, json.tasks);
  }
  return list;
};

export const restJsonToLists = (json: any): List[] => {
  const lists = new Array<List>();
  for (let i = 0; i < json.length; i++) {
    const list = restJsonToList(json[i]);
    lists.push(list);
  }

  return lists;
};

export const restJsonToListTasks = (listId: number, json: any): Payload => {
  const payload = new Payload();
  payload.tasks = restJsonToTasks(json);
  payload.listTasks = [];
  for (const task of payload.tasks) {
    const listTask = new ListTask(listId, task.taskId);
    payload.listTasks.push(listTask);
  }
  return payload;
};

export const restJsonToListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = restParseInt(json.roleId);
  listRole.listId = restParseInt(json.listId);
  listRole.secret = restParseString(json.secret);
  listRole.type = restJsonToListRoleType(json.type);
  return listRole;
};

export const restJsonToListRoleUser = (json: any): ListRoleUser => {
  const listRoleUser = new ListRoleUser(json.roleId, json.userId);
  return listRoleUser;
};

export const listRoleToRestJson = (listRole: ListRole): Object => ({
  roleId: listRole.roleId,
  listId: listRole.listId,
  type: listRole.type,
  secret: listRole.secret
});
