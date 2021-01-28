
import {addListTaskMutationToRestJson} from 'listlab-api/mutations/AddListTaskMutation';
import {createTaskCreationGroupMutationToRestJson} from 'listlab-api/mutations/CreateTaskCreationGroupMutation';
import {deleteTaskMutationToRestJson} from 'listlab-api/mutations/DeleteTaskMutation';
import {markTaskInboxMutationToRestJson} from 'listlab-api/mutations/MarkTaskInboxMutation';
import {markTaskSeenMutationToRestJson} from 'listlab-api/mutations/MarkTaskSeenMutation';
import {removeListTaskMutationToRestJson} from 'listlab-api/mutations/RemoveListTaskMutation';
import {updateTaskPropsMutationToRestJson} from 'listlab-api/mutations/UpdateTaskPropsMutation';
import TaskMuation from 'listlab-api/TaskMutation';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';

const taskMutationToRestJson = (mutation: TaskMuation) => {
  switch (mutation.type) {

    case TaskMutationTypes.ADD_LIST_TASK:
      return addListTaskMutationToRestJson(mutation);

    case TaskMutationTypes.CREATE_TASK_CREATION_GROUP:
      return createTaskCreationGroupMutationToRestJson(mutation);

    case TaskMutationTypes.DELETE_TASK:
      return deleteTaskMutationToRestJson(mutation);

    case TaskMutationTypes.MARK_TASK_SEEN:
      return markTaskSeenMutationToRestJson(mutation);

    case TaskMutationTypes.MARK_TASK_INBOX:
      return markTaskInboxMutationToRestJson(mutation);

    case TaskMutationTypes.UPDATE_TASK_PROPS:
      return updateTaskPropsMutationToRestJson(mutation);

    case TaskMutationTypes.REMOVE_LIST_TASK:
      return removeListTaskMutationToRestJson(mutation);

    default:
      throw Error(`taskMutationToRestJson missing type ${mutation.type}`);
      break;
  }
};

export default taskMutationToRestJson;