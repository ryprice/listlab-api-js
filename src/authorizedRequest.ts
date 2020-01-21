import axios, {
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import ListlabApiConfig from 'listlab-api/ListlabApiConfig';

export const authorizedRequest = async <T>(
  config: ListlabApiConfig,
  ajaxSettings: AxiosRequestConfig
): Promise<T> => {
  if (ajaxSettings.headers === undefined) {
    ajaxSettings.headers = {};
  }
  ajaxSettings.headers['Authorization'] = config.AuthToken;
  const returnXHR = axios.create({}).request<T>(ajaxSettings);
  try {
    const response = await returnXHR;
    return response.data;
  } catch (response) {
    config.handleHttpError && config.handleHttpError(response);
    throw response;
  }
};

export const authorizedRequestRaw = <T>(
  config: ListlabApiConfig,
  ajaxSettings: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  if (ajaxSettings.headers === undefined) {
    ajaxSettings.headers = {};
  }
  ajaxSettings.headers['Authorization'] = config.AuthToken;
  return axios.create({}).request<T>(ajaxSettings);
};


export default authorizedRequest;
