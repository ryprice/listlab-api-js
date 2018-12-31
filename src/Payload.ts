import List from "ququmber-api/List";
import ListRole from 'ququmber-api/ListRole';
import ListRoleUser from "ququmber-api/ListRoleUser";
import ListTask from "ququmber-api/ListTask";
import Recurrence from "ququmber-api/Recurrence";
import Task from "ququmber-api/Task";
import TaskRole from "ququmber-api/TaskRole";
import TaskShare from "ququmber-api/TaskShare";
import User from "ququmber-api/User";

export default class Payload {

  public lists: List[];
  public listRoles: ListRole[];
  public listRoleUsers: ListRoleUser[];

  public tasks: Task[];
  public taskRoles: TaskRole[];
  public taskShares: TaskShare[];
  public listTasks: ListTask[];
  public recurrences: Recurrence[];

  public users: User[];
}
