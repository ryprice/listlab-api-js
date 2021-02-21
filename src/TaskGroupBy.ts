enum TaskGroupBy {
  DUE = 'due',
  LIST = 'list',
  NONE = 'none',
  PARENT = 'parent',
}

export const taskGroupByLabel = (groupBy: TaskGroupBy) => {
  switch(groupBy) {
    case TaskGroupBy.PARENT: return 'Parent/subtask';
    case TaskGroupBy.NONE: return 'None';
    case TaskGroupBy.DUE: return 'Due';
    case TaskGroupBy.LIST: return 'Tag';
  }
};

export default TaskGroupBy;
