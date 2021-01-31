enum TaskSortOrder {
  DUE = 'due',
  PARENT_ORDER = 'parent_order',
  COMPLETION_TIME = 'completion_time',
  CREATION_TIME = 'creation_time',
  CHILD_COUNT = 'child_count',
  INCOMPLETE_CHILD_COUNT = 'incomplete_child_count',
}

export const taskSortOrderLabel = (sortOrder: TaskSortOrder) => {
  switch(sortOrder) {
    case TaskSortOrder.PARENT_ORDER: return 'Parent/subtask';
    case TaskSortOrder.DUE: return 'Due date';
    case TaskSortOrder.CREATION_TIME: return 'Creation date';
    case TaskSortOrder.COMPLETION_TIME: return 'Completion date';
    case TaskSortOrder.CHILD_COUNT: return 'Subtask count';
    case TaskSortOrder.INCOMPLETE_CHILD_COUNT: return 'Incomplete subtask count';
  }
};

export default TaskSortOrder;