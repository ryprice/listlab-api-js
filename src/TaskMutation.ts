import {AddListTaskMutation} from 'listlab-api/mutations/AddListTaskMutation';
import {CreateTaskCreationGroupMutation} from 'listlab-api/mutations/CreateTaskCreationGroupMutation';
import {DeleteTaskMutation} from 'listlab-api/mutations/DeleteTaskMutation';
import {MarkTaskInboxMutation} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {MarkTaskSeenMutation} from 'listlab-api/mutations/MarkTaskSeenMutation';
import {MoveTaskMutation} from 'listlab-api/mutations/MoveTaskMutation';
import {RemoveListTaskMutation} from 'listlab-api/mutations/RemoveListTaskMutation';
import {UpdateTaskPropsMutation} from 'listlab-api/mutations/UpdateTaskPropsMutation';

type TaskMutation = (
  AddListTaskMutation |
  CreateTaskCreationGroupMutation |
  DeleteTaskMutation |
  MarkTaskInboxMutation |
  MarkTaskSeenMutation |
  MoveTaskMutation |
  RemoveListTaskMutation |
  UpdateTaskPropsMutation
);

export default TaskMutation;