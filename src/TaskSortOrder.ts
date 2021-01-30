enum TaskSortOrder {
  DUE = 'due',
  PARENT_ORDER = 'parent_order',
  COMPLETION_TIME = 'completion_time',
  CREATION_TIME = 'creation_time',
}

export const taskSortOrderLabel = (sortOrder: TaskSortOrder) => {
  switch(sortOrder) {
    case TaskSortOrder.PARENT_ORDER: return 'Parent/child';
    case TaskSortOrder.DUE: return 'Due date';
    case TaskSortOrder.CREATION_TIME: return 'Creation date';
    case TaskSortOrder.COMPLETION_TIME: return 'Completion date';
  }
};

export default TaskSortOrder;