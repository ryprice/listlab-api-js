import FuzzyTimeRange from 'listlab-api/FuzzyTimeRange';

export default class TaskFilter {
  public readonly listId: number;
  public readonly range: FuzzyTimeRange;
  public readonly parentId: number;
  public readonly completed: boolean;
  public readonly query: string;
  public readonly inProgress: boolean;
  public readonly seen: boolean;
  public readonly taskIds: number[];

  constructor(init?: {[P in keyof TaskFilter]?: TaskFilter[P]}) {
    if (init) {
      this.listId = init.listId;
      this.range = init.range;
      this.parentId = init.parentId;
      this.completed = init.completed;
      this.query = init.query;
      this.inProgress = init.inProgress;
      this.seen = init.seen;
      this.taskIds = init.taskIds;
    }
  }

  public setRange(range: FuzzyTimeRange): TaskFilter {
    return new TaskFilter({
      ...(this as TaskFilter),
      range
    });
  }

  public setParentId(parentId: number): TaskFilter {
    return new TaskFilter({
      ...(this as TaskFilter),
      parentId
    });
  }

  public setListId(listId: number): TaskFilter {
    return new TaskFilter({
      ...(this as TaskFilter),
      listId
    });
  }

  public setCompleted(completed: boolean): TaskFilter {
    return new TaskFilter({
      ...(this as TaskFilter),
      completed
    });
  }

  public isEmpty(): boolean {
    return (
      !this.listId &&
      !this.parentId &&
      this.completed == null &&
      (!this.query || this.query.length < 1) &&
      this.inProgress == null &&
      this.seen == null &&
      (
        this.range == null ||
        this.range.getStart() == null ||
        this.range.getEnd() == null
      ) &&
      !this.taskIds
    );
  }

  public equals(other: TaskFilter): boolean {
    return (
      this.listId === other.listId &&
      this.range === other.range &&
      this.parentId === other.parentId &&
      this.completed === other.completed &&
      this.query === other.query &&
      this.inProgress === other.inProgress &&
      this.seen === other.seen &&
      this.taskIds === other.taskIds
    );
  }

  public without(other: TaskFilter) {
    let result: TaskFilter = this;
    if (other.listId) {
      result = result.setListId(null);
    }
    if (other.parentId) {
      result = result.setParentId(null);
    }
    if (other.completed != null) {
      result = result.setCompleted(null);
    }
    return result;
  }

  public merge(other: TaskFilter) {
    return new TaskFilter({
      ...(this as TaskFilter),
      ...other
    });
  }
}
