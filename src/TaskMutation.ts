import {MarkTaskInboxMutation} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {MarkTaskSeenMutation} from 'listlab-api/mutations/MarkTaskSeenMutation';

type TaskMutation = (
  MarkTaskInboxMutation |
  MarkTaskSeenMutation
);

export default TaskMutation;