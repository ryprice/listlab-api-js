import {restParseString} from 'listlab-api/utils/restParamParsers';

enum TaskCreationSource {
  WEB = 'WEB',
  CHROME = 'CHROME',
};

export const restJsonToTaskCreationSource = (json: any): TaskCreationSource => {
  if (json == null) {
    return null;
  }
  const source = TaskCreationSource[restParseString(json) as keyof typeof TaskCreationSource];
  return source;
};

export const taskCreationSourceToRestJson = (source: TaskCreationSource): string => {
  return TaskCreationSource[source];
};

export const taskCreationSourceLabel = (source: TaskCreationSource): string => {
  switch (source) {
    case TaskCreationSource.CHROME: return 'Chrome extension';
    case TaskCreationSource.WEB: return 'ListLab web';
  }
};

export default TaskCreationSource;