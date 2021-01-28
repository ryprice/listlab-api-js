import {AxiosRequestConfig} from 'axios';

import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';

interface RequestQueueObject {
  resolve: (response: any) => void;
  reject: (response: any) => void;
  ajaxSettings: AxiosRequestConfig;
}

type RequestQueueListener = (running: boolean) => void;

// Lazy way of guarenteeing order of operations by
// performing requests in serial
export default class RequestQueue {

  private readonly config: ListlabApiConfig;

  private readonly requestQueue: RequestQueueObject[] = [];

  private listeners: RequestQueueListener[] = [];

  private isRunning = false;

  constructor(config: ListlabApiConfig) {
    this.config = config;
  }

  private async start() {
    this.isRunning = true;
    this.fireListener(true);
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
    this.fireListener(false);
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

  addListener(listener: RequestQueueListener) {
    this.listeners = this.listeners.concat([listener]);
  }

  removeListener(listener: RequestQueueListener) {
    this.listeners = this.listeners.filter(l => listener === l);
  }

  private fireListener(running: boolean) {
    this.listeners.forEach(l => l(running));
  }
}
