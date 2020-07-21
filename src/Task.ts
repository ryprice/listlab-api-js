import FuzzyGranularity from 'listlab-api/FuzzyGranularity';
import FuzzyTime, {buildFuzzyTime, unoffsetNow} from 'listlab-api/FuzzyTime';
import MaybeUser from 'listlab-api/MaybeUser';

export default class Task {
  public taskId: number;
  public parentId: number;
  public owner: MaybeUser;
  public name: string;
  public due: FuzzyTime;
  public completed: boolean;
  public childCount: number;
  public incompleteChildCount: number;
  public isShared: boolean;
  public seen: boolean;
  public recurrenceId: number;
  public creationTime: Date;
  public completionTime: Date;
  public readRole: number;
  public writeRole: number;
  public author: number;
  public canRead: boolean;
  public canWrite: boolean;

  constructor() {
    this.name = '';
    this.completed = false;
    this.seen = true;
    this.due = buildFuzzyTime(new Date(unoffsetNow()), FuzzyGranularity.DAY);
    this.owner = new MaybeUser(null, null);
    this.childCount = 0;
    this.incompleteChildCount = 0;
  }

  clone(): Task {
    const clone = new Task();
    clone.taskId = this.taskId;
    clone.parentId = this.parentId;
    clone.owner = this.owner;
    clone.name = this.name;
    clone.due = this.due;
    clone.completed = this.completed;
    clone.childCount = this.childCount;
    clone.isShared = this.isShared;
    clone.incompleteChildCount = this.incompleteChildCount;
    clone.seen = this.seen;
    clone.recurrenceId = this.recurrenceId;
    clone.creationTime = this.creationTime;
    clone.completionTime = this.completionTime;
    clone.readRole = this.readRole;
    clone.writeRole = this.writeRole;
    clone.author = this.author;
    clone.canRead = this.canRead;
    clone.canWrite = this.canWrite;
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