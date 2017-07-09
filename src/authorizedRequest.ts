import * as axios from "axios";
import AxiosXHRConfig = Axios.AxiosXHRConfig;
import {IPromise} from "q";

import {TaskApiConfig} from "./TaskApiConfig";

export const authorizedRequest = <T>(config: TaskApiConfig, ajaxSettings: AxiosXHRConfig<T>): IPromise<T> => {
    if (ajaxSettings.headers === undefined) {
        ajaxSettings.headers = {};
    }
    ajaxSettings.headers["Authorization"] = config.AuthToken;
    const returnXHR = axios(ajaxSettings);
    returnXHR.catch(config.handleHttpError ? config.handleHttpError : () => {});
    return returnXHR.then(response => response.data);
};
