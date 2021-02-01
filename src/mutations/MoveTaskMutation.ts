import {taskMoveOrderTypeFromString, TaskMoveOrderType} from 'listlab-api/TaskMoveParams';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseInt} from 'listlab-api/utils/restParamParsers';

export type MoveTaskMutation = {
  type: 'MOVE_TASK',
  params: {
    taskId: number;
    before?: number;
    after?: number;
    parent?: number;
    orderType?: TaskMoveOrderType;
  }
};

export const restParseMoveTaskMutation = (
  mutation: {type: TaskMutationTypes.MOVE_TASK, params: any}
): MoveTaskMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskId: restParseInt(params.taskId),
      parent: restParseInt(params.parent),
      before: restParseInt(params.before),
      after: restParseInt(params.after),
      orderType: taskMoveOrderTypeFromString(params.orderType)
    }
  };
};

export const moveTaskMutationToRestJson = (
  mutation: MoveTaskMutation
) => mutation;