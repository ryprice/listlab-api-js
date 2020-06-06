import TaskRole from 'listlab-api/TaskRole';
import TaskRoleType from 'listlab-api/TaskRoleType';
import TaskRoleUser from 'listlab-api/TaskRoleUser';
import {restParseInt, restParseString} from 'listlab-api/utils/restParamParsers';

export const restJsonToTaskRole = (json: any): TaskRole => {
  const taskRole = new TaskRole();
  taskRole.roleId = restParseInt(json.roleId);
  taskRole.taskId = restParseInt(json.taskId);
  taskRole.secret = restParseString(json.secret);
  taskRole.type = restJsonToTaskRoleType(json.type);
  return taskRole;
};

export const restJsonToTaskRoleUser = (json: any): TaskRoleUser => {
  return new TaskRoleUser(json.roleId, json.userId);
};

export const taskRoleToRestJson = (taskRole: TaskRole): Object => ({
  roleId: taskRole.roleId,
  taskId: taskRole.taskId,
  type: taskRole.type,
  secret: taskRole.secret
});

export const restJsonToTaskRoleType = (json: any): TaskRoleType => {
  if (typeof json === 'string' || json instanceof String) {
    if (json.toLowerCase() === 'read') {
      return TaskRoleType.READ;
    } else if (json.toLowerCase() === 'write'){
      return TaskRoleType.WRITE;
    }
  }
  return null;
};

export const taskRoleTypeToRestJson = (type: TaskRoleType) => {
  switch (type) {
    case TaskRoleType.READ: return 'read';
    case TaskRoleType.WRITE: return 'write';
  }
};
