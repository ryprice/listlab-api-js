import authorizedRequest from 'ququmber-api/authorizedRequest';
import ListRole from 'ququmber-api/ListRole';
import ListRoleType, {
  consumeListRoleType,
  generateListRoleTypeJson
} from 'ququmber-api/ListRoleType';
import ListRoleUser from 'ququmber-api/ListRoleUser';
import TaskApiConfig from 'ququmber-api/TaskApiConfig';

export default class ListPermissionClient {

  private listServiceAddress: string;

  private config: TaskApiConfig;

  constructor(config: TaskApiConfig) {
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

export const consumeListRole = (json: any): ListRole => {
  const listRole = new ListRole();
  listRole.roleId = json.roleId;
  listRole.listId = json.listId;
  listRole.secret = json.secret;
  listRole.type = consumeListRoleType(json.type);
  return listRole;
};

export const consumeListRoleUser = (json: any): ListRoleUser => {
  const listRoleUser = new ListRoleUser(json.roleId, json.userId);
  return listRoleUser;
};

export const generateListRoleJson = (listRole: ListRole): Object => ({
  roleId: listRole.roleId,
  listId: listRole.listId,
  type: listRole.type,
  secret: listRole.secret
});
