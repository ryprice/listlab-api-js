enum TaskRoleType {
  READ,
  WRITE
}

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

export const mostPermissiveTaskRoleType = (types: TaskRoleType[]) => {
  if (types.indexOf(TaskRoleType.WRITE) > -1) {
    return TaskRoleType.WRITE;
  }
  if (types.indexOf(TaskRoleType.READ) > -1) {
    return TaskRoleType.WRITE;
  }
  return null;
};


export default TaskRoleType;
