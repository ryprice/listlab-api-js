import MaybeUser from 'listlab-api/MaybeUser';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restJsonToMaybeUser} from 'listlab-api/userSerialization';
import {restParseIntArr} from 'listlab-api/utils/restParamParsers';

export type AssignTaskMutation = {
  type: 'ASSIGN_TASK';
  params: {
    taskIds: number[];
    maybeUser: MaybeUser;
  };
};

export const restParseAssignTaskMutation = (
  mutation: {type: TaskMutationTypes.ASSIGN_TASK, params: any}
): AssignTaskMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskIds: restParseIntArr(params.taskIds),
      maybeUser: restJsonToMaybeUser(params.maybeUser)
    }
  };
};

export const assignTaskMutationToRestJson = (
  mutation: AssignTaskMutation
) => mutation;