import axios, {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import {IPromise} from "q";

import TaskApiConfig from "ququmber-api/TaskApiConfig";

export const authorizedRequest = <T>(
  config: TaskApiConfig,
  ajaxSettings: AxiosRequestConfig
): IPromise<T> => {
  if (ajaxSettings.headers === undefined) {
    ajaxSettings.headers = {};
  }
  ajaxSettings.headers["Authorization"] = config.AuthToken;
  const returnXHR = axios.create({}).request<T>(ajaxSettings);
  return returnXHR.then(
    (response: any) => response.data,
    (response: any) => {
      config.handleHttpError && config.handleHttpError(response);
    }
  );
};

export const authorizedRequestRaw = <T>(
  config: TaskApiConfig,
  ajaxSettings: AxiosRequestConfig
): IPromise<AxiosResponse<T>> => {
  if (ajaxSettings.headers === undefined) {
    ajaxSettings.headers = {};
  }
  ajaxSettings.headers["Authorization"] = config.AuthToken;
  return axios.create({}).request<T>(ajaxSettings);
};


export default authorizedRequest;
