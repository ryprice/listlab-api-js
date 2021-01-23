import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseInt, restParseIntArr} from 'listlab-api/utils/restParamParsers';

export type RemoveListTaskMutation = {
  type: 'REMOVE_LIST_TASK',
  params: {
    taskIds: number[];
    listId: number
  }
};

export const restParseRemoveListTaskMutation = (
  mutation: {type: TaskMutationTypes.REMOVE_LIST_TASK, params: any}
): RemoveListTaskMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskIds: restParseIntArr(params.taskIds),
      listId: restParseInt(params.listId)
    }
  };
};

export const removeListTaskMutationToRestJson = (
  mutation: RemoveListTaskMutation
) => mutation;