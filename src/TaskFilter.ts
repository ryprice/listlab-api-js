import {pickBy} from 'lodash';

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

  public without(other: TaskFilter): TaskFilter {
    let result: TaskFilter = this;
    console.log(Object.keys(this));
    if (other.listId) {
      result = result.setListId(undefined);
    }
    if (other.parentId) {
      result = result.setParentId(undefined);
    }
    if (other.completed != null) {
      result = result.setCompleted(undefined);
    }
    return result;
  }

  public merge(other: TaskFilter): TaskFilter {
    // Removes undefined values
    const notUndefined = (v: any) => v !== undefined;
    return new TaskFilter({
      ...pickBy((this as TaskFilter), notUndefined),
      ...pickBy(other, notUndefined),
    });
  }
}
