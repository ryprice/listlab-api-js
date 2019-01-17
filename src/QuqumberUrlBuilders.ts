import TaskApiConfig from 'ququmber-api/TaskApiConfig';

export const buildListUrl = (listId: number, config: TaskApiConfig) => {
  return `${config.AppAddress}/l/${listId}`;
};

export const buildTaskUrl = (taskId: number, config: TaskApiConfig) => {
  return `${config.AppAddress}/t/${taskId}`;
};

export const buildPublicListUrl = (
  listId: number,
  secret: string,
  config: TaskApiConfig
) => {
  return `${buildListUrl(listId, config)}?s=${secret}`;
};

export const buildPublicTaskUrl = (
  taskId: number,
  secret: string,
  config: TaskApiConfig
) => {
  return `${buildTaskUrl(taskId, config)}?s=${secret}`;
};
