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
}
