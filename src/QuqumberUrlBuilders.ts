import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export const buildListUrl = (listId: number, config: QuqumberApiConfig) => {
  return `${config.AppAddress}/l/${listId}`;
};

export const buildTaskUrl = (taskId: number, config: QuqumberApiConfig) => {
  return `${config.AppAddress}/t/${taskId}`;
};

export const buildPublicListUrl = (
  listId: number,
  secret: string,
  config: QuqumberApiConfig
) => {
  return `${buildListUrl(listId, config)}?s=${secret}`;
};

export const buildPublicTaskUrl = (
  taskId: number,
  secret: string,
  config: QuqumberApiConfig
) => {
  return `${buildTaskUrl(taskId, config)}?s=${secret}`;
};
