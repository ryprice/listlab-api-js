import {AxiosRequestConfig} from 'axios';

import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';

interface RequestQueueObject {
  resolve: (response: any) => void;
  reject: (response: any) => void;
  ajaxSettings: AxiosRequestConfig;
}

// Lazy way of guarenteeing order of operations by
// performing requests in serial
export default class RequestQueue {

  private readonly config: ListlabApiConfig;

  private readonly requestQueue: RequestQueueObject[] = [];

  private isRunning = false;

  constructor(config: ListlabApiConfig) {
    this.config = config;
  }

  private async start() {
    this.isRunning = true;
    while (this.requestQueue.length > 0) {
      const curRequestQueueObj = this.requestQueue.shift();
      try {
        curRequestQueueObj.resolve(
          // eslint-disable-next-line no-await-in-loop
          await authorizedRequest(this.config, curRequestQueueObj.ajaxSettings)
        );
      } catch (ex) {
        curRequestQueueObj.reject(ex);
      }
    }
    this.isRunning = false;
  }

  queue(ajaxSettings: AxiosRequestConfig) {
    const requestQueueObject: RequestQueueObject = {} as RequestQueueObject;
    const promise = new Promise((resolve, reject) => {
      requestQueueObject.resolve = resolve;
      requestQueueObject.reject = reject;
    });
    requestQueueObject.ajaxSettings = ajaxSettings;
    this.requestQueue.push(requestQueueObject);

    if (!this.isRunning) {
      this.start();
    }
    return promise;
  }
}
