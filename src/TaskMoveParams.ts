export enum TaskMoveType {
  DUE_ORDER = 'due_order',
  PARENT_ORDER = 'parent_order',
};

export enum TaskMoveRelativePosition {
  BEFORE,
  AFTER
};

type TaskMoveParams = {
  parent?: number,
  before?: number,
  after?: number,
  type: TaskMoveType
};

export default TaskMoveParams;