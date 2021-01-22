import Task from 'listlab-api/Task';
import TaskMutationTypes from 'listlab-api/TaskMutationTypes';
import {restJsonToTask, taskToRestJson} from 'listlab-api/taskSerialization';

export type UpdateTaskPropsMutation = {
  type: 'UPDATE_TASK_PROPS',
  params: {
    tasks: Task[];
  }
};

export const restParseUpdateTaskPropsMutation = (
  mutation: {type: TaskMutationTypes.UPDATE_TASK_PROPS, params: any}
): UpdateTaskPropsMutation => {
  const {type, params} = mutation;
  if (!Array.isArray(params.tasks)) {
    throw Error('UPDATE_TASKS params.tasks should be array.');
  }

  return {
    type,
    params: {
      tasks: params.tasks.map(restJsonToTask)
    }
  };
};

export const updateTaskPropsMutationToRestJson = (
  mutation: UpdateTaskPropsMutation
) => ({
  type: mutation.type,
  params: {
    tasks: mutation.params.tasks.map(taskToRestJson)
  }
});