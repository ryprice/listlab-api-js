import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseIntArr} from 'listlab-api/utils/restParamParsers';

export type DeleteTaskMutation = {
  type: 'DELETE_TASK',
  params: {
    taskIds: number[];
  }
};

export const restParseDeleteTaskMutation = (
  mutation: {type: TaskMutationTypes.DELETE_TASK, params: any}
): DeleteTaskMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskIds: restParseIntArr(params.taskIds),
    }
  };
};

export const deleteTaskMutationToRestJson = (
  mutation: DeleteTaskMutation
) => mutation;