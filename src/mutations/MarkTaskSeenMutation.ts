import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseBool, restParseInt} from 'listlab-api/utils/restParamParsers';

export type MarkTaskSeenMutation = {
  type: 'MARK_TASK_SEEN',
  params: {
    taskId: number;
    seen: boolean
  }
};

export const restParseMarkTaskSeenMutation = (
  mutation: {type: TaskMutationTypes.MARK_TASK_SEEN, params: any}
): MarkTaskSeenMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskId: restParseInt(params.taskId),
      seen: restParseBool(params.seen)
    }
  };
};