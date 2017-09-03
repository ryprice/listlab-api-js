import {TaskApiConfig} from './TaskApiConfig';

export const buildPublicListUrl = (listId: number, secret: string, config: TaskApiConfig) => {
    return `${config.AppAddress}/l/${listId}?s=${secret}`;
};
