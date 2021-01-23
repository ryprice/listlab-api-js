import TaskCreationSource, {restJsonToTaskCreationSource} from 'listlab-api/TaskCreationSource';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';

export type CreateTaskCreationGroupMutation = {
  type: 'CREATE_TASK_CREATION_GROUP',
  params: {
    source: TaskCreationSource;
  }
};

export const restParseCreateTaskCreationGroupMutation = (
  mutation: {type: TaskMutationTypes.CREATE_TASK_CREATION_GROUP, params: any}
): CreateTaskCreationGroupMutation => {
  const {type, params} = mutation;
  return {
    type,
    params: {
      source: restJsonToTaskCreationSource(params.source),
    }
  };
};

export const createTaskCreationGroupMutationToRestJson = (
  mutation: CreateTaskCreationGroupMutation
) => mutation;