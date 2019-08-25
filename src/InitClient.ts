import authorizedRequest from 'ququmber-api/authorizedRequest';
import Payload from 'ququmber-api/Payload';
import {consumePayloadResult} from 'ququmber-api/payloadSerialization';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

export default class InitClient {

  private readonly initServiceAddress: string;

  private readonly config: QuqumberApiConfig;

  constructor(config: QuqumberApiConfig) {
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
