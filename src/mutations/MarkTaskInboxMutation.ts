import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restParseBool, restParseIntArr} from 'listlab-api/utils/restParamParsers';

export type MarkTaskInboxMutation = {
  type: 'MARK_TASK_INBOX',
  params: {
    taskIds: number[];
    inbox: boolean
  }
};

export const restParseMarkTaskInboxMutation = (
  mutation: {type: TaskMutationTypes.MARK_TASK_INBOX, params: any}
): MarkTaskInboxMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      taskIds: restParseIntArr(params.taskIds),
      inbox: restParseBool(params.inbox)
    }
  };
};