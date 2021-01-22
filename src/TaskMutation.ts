import {MarkTaskInboxMutation} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {MarkTaskSeenMutation} from 'listlab-api/mutations/MarkTaskSeenMutation';
import {UpdateTaskPropsMutation} from './mutations/UpdateTaskPropsMutation';

type TaskMutation = (
  MarkTaskInboxMutation |
  MarkTaskSeenMutation |
  UpdateTaskPropsMutation
);

export default TaskMutation;