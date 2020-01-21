import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import Payload from 'listlab-api/Payload';
import {consumePayloadResult} from 'listlab-api/payloadSerialization';

export default class InitClient {

  private readonly initServiceAddress: string;

  private readonly config: ListlabApiConfig;

  constructor(config: ListlabApiConfig) {
    this.config = config;
    this.initServiceAddress = `${config.TaskServiceAddress}/init`;
  }

  public async init(): Promise<Payload> {
    const ajaxSettings = {
      url: `${this.initServiceAddress}/app`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumePayloadResult(json);
  }
}
