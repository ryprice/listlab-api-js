import authorizedRequest from 'ququmber-api/authorizedRequest';
import List from 'ququmber-api/List';
import {consumeList, consumeLists, generateListJson} from 'ququmber-api/listSerialization';
import {consumePayloadResult} from 'ququmber-api/payloadSerialization';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export default class ListClient {

  private readonly listServiceAddress: string;

  private readonly config: QuqumberApiConfig;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
    this.listServiceAddress = `${config.ListServiceAddress}`;
  }

  async getList(listId: number): Promise<List> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}`,
      method: 'GET'
    };
    return authorizedRequest(this.config, ajaxSettings).then((json) => {
      return consumeList(json);
    });
  }

  async getLists() {
    const ajaxSettings = {
      url: this.listServiceAddress,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeLists(json);
  }

  async deleteList(list: List): Promise<List> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${list.listId}`,
      method: 'DELETE'
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {
      return list;
    });
  }

  async postList(list: List): Promise<List> {
    const ajaxSettings: any = {
      url: this.listServiceAddress,
      data: JSON.stringify(generateListJson(list)),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    };
    return authorizedRequest(this.config, ajaxSettings).then((json: any) => {
      const persistedId = this.consumeInsertResult(json);
      list.listId = persistedId;
      return list;
    });
  }

  async putList(list: List): Promise<List> {
    const ajaxSettings: any = {
      url: this.listServiceAddress,
      data: JSON.stringify(generateListJson(list)),
      headers: {'Content-Type': 'application/json'},
      method: 'PUT'
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => list);
  }

  async moveList(listId: number, parentId: number): Promise<void> {
    const ajaxSettings: any = {
      url: `${this.listServiceAddress}/${listId}/move?parent=${parentId}`,
      method: 'PUT'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async moveListBefore(listId: number, beforeId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/move?before=${beforeId}`,
      method: 'PUT'
    };
    return authorizedRequest(this.config, ajaxSettings).then(() => {});
  }

  async moveListAfter(listId: number, afterId: number) {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/move?after=${afterId}`,
      method: 'PUT'
    };
    return authorizedRequest(this.config, ajaxSettings);
  }

  async getListDetails(listId: number) {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/${listId}/details`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json);
  }

  async getListsByIds(ids: number[]) {
    if (ids.length < 1) {
      return Promise.resolve([]);
    }
    const ajaxSettings = {
      url: `${this.listServiceAddress}/byId?${ids.map(id => `id=${id}&`).join('')}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeLists(json);
  }

  constructEmptyEntity(): List {
    return new List();
  }

  consumeInsertResult(json: any): number {
    if (json.id) {
      return json.id;
    } else {
      return 0;
    }
  }
  getEntityId(list: List) {
    return list.listId;
  }

  setEntityId(list: List, id: number) {
    list.listId = id;
  }
}
