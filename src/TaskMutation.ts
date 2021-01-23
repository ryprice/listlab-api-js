import {AddListTaskMutation} from 'listlab-api/mutations/AddListTaskMutation';
import {CreateTaskCreationGroupMutation} from 'listlab-api/mutations/CreateTaskCreationGroupMutation';
import {MarkTaskInboxMutation} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {MarkTaskSeenMutation} from 'listlab-api/mutations/MarkTaskSeenMutation';
import {RemoveListTaskMutation} from 'listlab-api/mutations/RemoveListTaskMutation';
import {UpdateTaskPropsMutation} from 'listlab-api/mutations/UpdateTaskPropsMutation';

type TaskMutation = (
  AddListTaskMutation |
  CreateTaskCreationGroupMutation |
  MarkTaskInboxMutation |
  MarkTaskSeenMutation |
  RemoveListTaskMutation |
  UpdateTaskPropsMutation
);

export default TaskMutation;