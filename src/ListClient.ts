import {AxiosRequestConfig} from 'axios';

import authorizedRequest from 'listlab-api/authorizedRequest';
import List from 'listlab-api/List';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import {restJsonToList, restJsonToLists, listToRestJson} from 'listlab-api/listSerialization';
import {restJsonToPayloadResult} from 'listlab-api/payloadSerialization';

export default class ListClient {

  private readonly listServiceAddress: string;

  private readonly config: ListlabApiConfig;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.listServiceAddress = `${config.ListServiceAddress}`;
  }

  async getList(listId: number): Promise<List> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}`,
      method: 'GET'
    };
    return authorizedRequest(this.config, ajaxSettings).then(restJsonToList);
  }

  async getLists() {
    const ajaxSettings: AxiosRequestConfig = {
      url: this.listServiceAddress,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToLists(json);
  }

  async deleteList(list: List): Promise<List> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${list.listId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
    return list;
  }

  async postList(list: List): Promise<List> {
    const ajaxSettings: AxiosRequestConfig = {
      url: this.listServiceAddress,
      data: JSON.stringify(listToRestJson(list)),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    const response = await authorizedRequest(this.config, ajaxSettings);
    const persistedId = this.restJsonToInsertResult(response);
    list.listId = persistedId;
    return list;
  }

  async putList(list: List): Promise<List> {
    const ajaxSettings: AxiosRequestConfig = {
      url: this.listServiceAddress,
      data: JSON.stringify(listToRestJson(list)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
    return list;
  }

  async moveList(listId: number, parentId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/move?parent=${parentId}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async archiveList(listId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/archive`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async unarchiveList(listId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/unarchive`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async moveListBefore(listId: number, beforeId: number): Promise<void> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/move?before=${beforeId}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async moveListAfter(listId: number, afterId: number) {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/move?after=${afterId}`,
      method: 'PUT'
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  async getListDetails(listId: number) {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/${listId}/details`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }

  async getListsByIds(ids: number[]) {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.listServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToLists(json);
  }

  restJsonToInsertResult(json: any): number {
    if (json.id) {
      return json.id;
    } else {
      return 0;
    }
  }
}
