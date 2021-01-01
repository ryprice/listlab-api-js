import Actor from 'listlab-api/Actor';
import FuzzyGranularity from 'listlab-api/FuzzyGranularity';
import FuzzyTime, {buildFuzzyTime, unoffsetNow} from 'listlab-api/FuzzyTime';
import MaybeUser from 'listlab-api/MaybeUser';

export default class TaskUncontexted {
  public taskId: number;
  public parentId: number;
  public owner: MaybeUser;
  public name: string;
  public due: FuzzyTime;
  public completed: boolean;
  public childCount: number;
  public incompleteChildCount: number;
  public isShared: boolean;
  public recurrenceId: number;
  public creationTime: Date;
  public completionTime: Date;
  public readRole: number;
  public writeRole: number;
  public author: Actor;

  constructor() {
    this.name = '';
    this.completed = false;
    this.due = buildFuzzyTime(new Date(unoffsetNow()), FuzzyGranularity.DAY);
    this.owner = new MaybeUser(null, null);
    this.childCount = 0;
    this.incompleteChildCount = 0;
  }

  clone(): TaskUncontexted {
    const clone = new TaskUncontexted();
    applyTaskUncontextedClone(this, clone);
    return clone;
  }
};

export const applyTaskUncontextedClone = (orig: TaskUncontexted, clone: TaskUncontexted) => {
  clone.taskId = orig.taskId;
  clone.parentId = orig.parentId;
  clone.owner = orig.owner;
  clone.name = orig.name;
  clone.due = orig.due;
  clone.completed = orig.completed;
  clone.childCount = orig.childCount;
  clone.isShared = orig.isShared;
  clone.incompleteChildCount = orig.incompleteChildCount;
  clone.recurrenceId = orig.recurrenceId;
  clone.creationTime = orig.creationTime;
  clone.completionTime = orig.completionTime;
  clone.readRole = orig.readRole;
  clone.writeRole = orig.writeRole;
  clone.author = orig.author;
};