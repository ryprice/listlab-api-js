enum TaskRoleType {
  READ,
  WRITE
}

export const consumeTaskRoleType = (json: any): TaskRoleType => {
  if (json === 'read') {
    return TaskRoleType.READ;
  } else if (json === 'write'){
    return TaskRoleType.WRITE;
  }
  return null;
};

export const generateTaskRoleTypeJson = (type: TaskRoleType) => {
  switch (type) {
    case TaskRoleType.READ: return 'read';
    case TaskRoleType.WRITE: return 'write';
  }
};

export default TaskRoleType;
