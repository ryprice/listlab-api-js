import {markTaskInboxMutationToRestJson} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {markTaskSeenMutationToRestJson} from 'listlab-api/mutations/MarkTaskSeenMutation';
import {updateTaskPropsMutationToRestJson} from 'listlab-api/mutations/UpdateTaskPropsMutation';
import TaskMuation from 'listlab-api/TaskMutation';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';

const taskMutationToRestJson = (mutation: TaskMuation) => {
  switch (mutation.type) {
    case TaskMutationTypes.MARK_TASK_SEEN:
      return markTaskSeenMutationToRestJson(mutation);

    case TaskMutationTypes.MARK_TASK_INBOX:
      return markTaskInboxMutationToRestJson(mutation);

    case TaskMutationTypes.UPDATE_TASK_PROPS:
      return updateTaskPropsMutationToRestJson(mutation);

    default:
      throw Error(`taskMutationToRestJson missing type ${mutation.type}`);
  }
};

export default taskMutationToRestJson;