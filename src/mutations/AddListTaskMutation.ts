import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseInt, restParseIntArr} from 'listlab-api/utils/restParamParsers';

export type AddListTaskMutation = {
  type: 'ADD_LIST_TASK',
  params: {
    taskIds: number[];
    listId: number
  }
};

export const restParseAddListTaskMutation = (
  mutation: {type: TaskMutationTypes.ADD_LIST_TASK, params: any}
): AddListTaskMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskIds: restParseIntArr(params.taskIds),
      listId: restParseInt(params.listId)
    }
  };
};

export const addListTaskMutationToRestJson = (
  mutation: AddListTaskMutation
) => mutation;