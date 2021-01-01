import TaskUncontexted, {applyTaskUncontextedClone} from 'listlab-api/TaskUncontexted';

export default class Task extends TaskUncontexted {
  // Viewer contextual properties
  public seen: boolean;
  public canRead: boolean;
  public canWrite: boolean;
  public inbox: boolean;

  constructor() {
    super();
    this.seen = true;
  }

  clone(): Task {
    const clone = new Task();
    applyTaskUncontextedClone(this, clone);

    clone.seen = this.seen;
    clone.canRead = this.canRead;
    clone.canWrite = this.canWrite;
    clone.inbox = this.inbox;

    return clone;
  }
}

export const idComparator = (a: Task, b: Task) => {
  if (a.taskId < b.taskId) {
    return -1;
  } else if (a.taskId > b.taskId) {
    return 1;
  } else {
    return 0;
  }
};

export const completionTimeComparator = (a: Task, b: Task) => {
  if (!a.completionTime) {
    return -1;
  } else if (a.completionTime < b.completionTime) {
    return -1;
  } else if (a.completionTime === b.completionTime) {
    return 0;
  } else {
    return 1;
  }
};

export const creationTimeComparator = (a: Task, b: Task) => {
  if (!a.creationTime) {
    return -1;
  } else if (a.creationTime < b.creationTime) {
    return -1;
  } else if (a.creationTime === b.creationTime) {
    return 0;
  } else {
    return 1;
  }
};

export const dueComparator = (a: Task, b: Task) => {
  if (!a.due) {
    return -1;
  } else if (a.due < b.due) {
    return -1;
  } else if (a.due === b.due) {
    return 0;
  } else {
    return 1;
  }
};