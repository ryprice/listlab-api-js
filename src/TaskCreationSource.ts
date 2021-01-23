import {restParseString} from 'listlab-api/utils/restParamParsers';

enum TaskCreationSource {
  WEB = 'WEB',
};

export const restJsonToTaskCreationSource = (json: any): TaskCreationSource => {
  const source = TaskCreationSource[restParseString(json) as keyof typeof TaskCreationSource];
  if (source == null) {
    throw new Error(`restJsonToTaskCreationSource missing type ${json}`);
  }
  return source;
};

export const taskCreationSourceToRestJson = (type: TaskCreationSource) => {
  return TaskCreationSource[type];
};

export default TaskCreationSource;