import TaskRole from 'listlab-api/TaskRole';
import TaskRoleType from 'listlab-api/TaskRoleType';
import TaskRoleUser from 'listlab-api/TaskRoleUser';

export const consumeTaskRole = (json: any): TaskRole => {
  const taskRole = new TaskRole();
  taskRole.roleId = json.roleId;
  taskRole.taskId = json.taskId;
  taskRole.secret = json.secret;
  taskRole.type = consumeTaskRoleType(json.type);
  return taskRole;
};

export const consumeTaskRoleUser = (json: any): TaskRoleUser => {
  return new TaskRoleUser(json.roleId, json.userId);
};

export const generateTaskRoleJson = (taskRole: TaskRole): Object => ({
  roleId: taskRole.roleId,
  taskId: taskRole.taskId,
  type: taskRole.type,
  secret: taskRole.secret
});

export const consumeTaskRoleType = (json: any): TaskRoleType => {
  if (typeof json === 'string' || json instanceof String) {
    if (json.toLowerCase() === 'read') {
      return TaskRoleType.READ;
    } else if (json.toLowerCase() === 'write'){
      return TaskRoleType.WRITE;
    }
  }
  return null;
};

export const generateTaskRoleTypeJson = (type: TaskRoleType) => {
  switch (type) {
    case TaskRoleType.READ: return 'read';
    case TaskRoleType.WRITE: return 'write';
  }
};
