import authorizedRequest from 'ququmber-api/authorizedRequest';
import ListRole from 'ququmber-api/ListRole';
import ListRoleType, {generateListRoleTypeJson} from 'ququmber-api/ListRoleType';
import {consumeListRole, generateListRoleJson} from 'ququmber-api/listSerialization';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export default class ListPermissionClient {

  private readonly listServiceAddress: string;

  private readonly config: QuqumberApiConfig;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
    this.listServiceAddress = config.ListServiceAddress;
  }

  async userKnowsSecret(listId: number, secret: string): Promise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?s=${secret}`,
      method: 'POST'
    };
    try {
      await authorizedRequest(this.config, ajaxSettings);
    } catch {
      console.log('failed to auth to this list');
    }
  }

  async addUserToList(userId: number, listId: number, type: ListRoleType): Promise<void> {
    const ajaxSettings = {
      url: (
        `${this.listServiceAddress}/permission/${listId}/user` +
        `?userId=${userId}&type=${generateListRoleTypeJson(type)}`
      ),
      method: 'POST'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async removeUserFromList(userId: number, listId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/user?userId=${userId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async addRoleToList(listId: number, type: ListRoleType): Promise<ListRole> {
    const secret = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?s=${secret}&type=${generateListRoleTypeJson(type)}`,
      method: 'POST'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeListRole(json);
  }

  async removeRoleFromList(listId: number, roleId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listId}/role?roleId=${roleId}`,
      method: 'DELETE'
    };
    await authorizedRequest(this.config, ajaxSettings);
  }

  async updateListRole(listRole: ListRole): Promise<void> {
    const ajaxSettings = {
      url: `${this.listServiceAddress}/permission/${listRole.listId}/role?roleId=${listRole.roleId}`,
      method: 'PUT',
      data: generateListRoleJson(listRole)
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}
