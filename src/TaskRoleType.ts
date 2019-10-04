enum TaskRoleType {
  READ,
  WRITE
}

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


export default TaskRoleType;
