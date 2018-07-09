import List from "./List";
import ListRole from './ListRole';
import ListShare from "./ListShare";
import ListTask from "./ListTask";
import Recurrence from "./Recurrence";
import Task from "./Task";
import TaskShare from "./TaskShare";
import User from "./User";

export default class Payload {
  public tasks: Task[];
  public taskShares: TaskShare[];
  public listTasks: ListTask[];
  public lists: List[];
  public users: User[];
  public recurrences: Recurrence[];
  public listShares: ListShare[];
  public listRoles: ListRole[];
}
