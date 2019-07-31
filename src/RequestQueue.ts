import {AxiosRequestConfig} from 'axios';

import authorizedRequest from 'ququmber-api/authorizedRequest';
import QuqumberApiConfig from 'ququmber-api/QuqumberApiConfig';

interface RequestQueueObject {
  resolve: (response: any) => void;
  reject: (response: any) => void;
  ajaxSettings: AxiosRequestConfig;
}

// Lazy way of guarenteeing order of operations by
// performing requests in serial
export default class RequestQueue {

  private config: QuqumberApiConfig;

  private requestQueue: RequestQueueObject[] = [];

  private isRunning = false;

  constructor(config: QuqumberApiConfig) {
    this.config = config;
  }

  private async start() {
    this.isRunning = true;
    while (this.requestQueue.length > 0) {
      const curRequestQueueObj = this.requestQueue.shift();
      try {
        curRequestQueueObj.resolve(
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
