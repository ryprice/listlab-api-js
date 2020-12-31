import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';
import List from 'listlab-api/List';
import ListRole from 'listlab-api/ListRole';
import ListRoleUser from 'listlab-api/ListRoleUser';
import ListTask from 'listlab-api/ListTask';
import Recurrence from 'listlab-api/Recurrence';
import Task from 'listlab-api/Task';
import TaskDueOrderTuple from 'listlab-api/TaskDueOrderTuple';
import TaskParentOrderTuple from 'listlab-api/TaskParentOrderTuple';
import TaskRole from 'listlab-api/TaskRole';
import TaskRoleUser from 'listlab-api/TaskRoleUser';
import User from 'listlab-api/User';

export default class Payload {

  public lists?: List[];
  public listRoles?: ListRole[];
  public listRoleUsers?: ListRoleUser[];

  public tasks?: Task[];
  public taskRoles?: TaskRole[];
  public taskRoleUsers?: TaskRoleUser[];
  public listTasks?: ListTask[];
  public recurrences?: Recurrence[];
  public taskParentOrders?: TaskParentOrderTuple[];
  public taskRootOrder?: CRDTOrderDoc<number>;
  public taskDueOrders?: TaskDueOrderTuple[];

  public users?: User[];
}
