import {AxiosRequestConfig}  from 'axios';

import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import Payload from 'listlab-api/Payload';
import {restJsonToPayloadResult} from 'listlab-api/payloadSerialization';

export default class InitClient {

  private readonly initServiceAddress: string;

  private readonly config: ListlabApiConfig;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.initServiceAddress = `${config.TaskServiceAddress}/init`;
  }

  public async init(params: {tasks?: boolean}): Promise<Payload> {
    const ajaxSettings: AxiosRequestConfig = {
      url: `${this.initServiceAddress}/app?tasks=${params.tasks === true ? 'true' : 'false'}`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return restJsonToPayloadResult(json);
  }
}
