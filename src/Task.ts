import FuzzyGranularity from "./FuzzyGranularity";
import FuzzyTime, {unoffsetNow} from "./FuzzyTime";

export default class Task {
  public taskId: number;
  public parentId: number;
  public userId: number;
  public name: string;
  public due: FuzzyTime;
  public completed: boolean;
  public childCount: number;
  public incompleteChildCount: number;
  public dueOrder: number;
  public seen: boolean;
  public recurrenceId: number;
  public creationTime: Date;
  public completionTime: Date;

  constructor() {
    this.name = "";
    this.completed = false;
    this.seen = true;
    this.due = new FuzzyTime(new Date(unoffsetNow()), FuzzyGranularity.DAY);
  }

  clone(): Task {
    const clone = new Task();
    clone.taskId = this.taskId;
    clone.parentId = this.parentId;
    clone.userId = this.userId;
    clone.name = this.name;
    clone.due = this.due;
    clone.completed = this.completed;
    clone.childCount = this.childCount;
    clone.incompleteChildCount = this.incompleteChildCount;
    clone.dueOrder = this.dueOrder;
    clone.seen = this.seen;
    clone.recurrenceId = this.recurrenceId;
    clone.creationTime = this.creationTime;
    clone.completionTime = this.completionTime;
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

export const dueComparator = (a: Task, b: Task) => {
  const compareResult = a.due.compareTo(b.due);

  if (compareResult !== 0) {
    return compareResult;
  } else {
    if (a.dueOrder < b.dueOrder) {
      return -1;
    } else if (a.dueOrder === b.dueOrder) {
      return 0;
    } else {
      return 1;
    }
  }
};
