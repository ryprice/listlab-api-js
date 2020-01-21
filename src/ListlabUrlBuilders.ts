import ListlabApiConfig from 'listlab-api/ListlabApiConfig';

export const buildListUrl = (listId: number, config: ListlabApiConfig) => {
  return `${config.AppAddress}/l/${listId}`;
};

export const buildTaskUrl = (taskId: number, config: ListlabApiConfig) => {
  return `${config.AppAddress}/t/${taskId}`;
};

export const buildPublicListUrl = (
  listId: number,
  secret: string,
  config: ListlabApiConfig
) => {
  return `${buildListUrl(listId, config)}?s=${secret}`;
};

export const buildPublicTaskUrl = (
  taskId: number,
  secret: string,
  config: ListlabApiConfig
) => {
  return `${buildTaskUrl(taskId, config)}?s=${secret}`;
};
