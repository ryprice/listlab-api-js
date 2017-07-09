import List from "./List";
import ListTask from "./ListTask";
import Recurrence from "./Recurrence";
import Task from "./Task";
import User from "./User";

export default class Payload {
    public tasks: Task[];
    public listTasks: ListTask[];
    public lists: List[];
    public users: User[];
    public recurrences: Recurrence[];
}
