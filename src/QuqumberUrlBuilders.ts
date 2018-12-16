import TaskApiConfig from 'ququmber-api/TaskApiConfig';

export const buildPublicListUrl = (
  listId: number,
  secret: string,
  config: TaskApiConfig
) => {
  return `${config.AppAddress}/l/${listId}?s=${secret}`;
};

export const buildPublicTaskUrl = (
  taskId: number,
  secret: string,
  config: TaskApiConfig
) => {
  return `${config.AppAddress}/t/${taskId}?s=${secret}`;
};
