import {create} from "axios";
import {IPromise} from "q";

import {TaskApiConfig} from "./TaskApiConfig";

export const authorizedRequest = <T>(config: TaskApiConfig, ajaxSettings: any): IPromise<T> => {
    if (ajaxSettings.headers === undefined) {
        ajaxSettings.headers = {};
    }
    ajaxSettings.headers["Authorization"] = config.AuthToken;
    const returnXHR = create({})(ajaxSettings);
    returnXHR.catch(config.handleHttpError ? config.handleHttpError : () => {});
    return returnXHR.then((response: any) => response.data as T);
};
