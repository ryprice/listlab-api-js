import List from "ququmber-api/List";
import ListRole from 'ququmber-api/ListRole';
import ListShare from "ququmber-api/ListShare";
import ListTask from "ququmber-api/ListTask";
import Recurrence from "ququmber-api/Recurrence";
import Task from "ququmber-api/Task";
import TaskShare from "ququmber-api/TaskShare";
import User from "ququmber-api/User";

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
