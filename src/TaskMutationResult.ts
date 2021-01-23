import Payload from 'listlab-api/Payload';
import {restJsonToPayloadResult} from 'listlab-api/payloadSerialization';

export type TaskMutationResult = {
  error?: string;
  payload?: Payload;
};

export const restJsonToTaskMutationResults = (results: any): TaskMutationResult[] => {
  if (!Array.isArray(results)) {
    throw Error('restJsonToTaskMutationResults not an array');
  }
  return results.map((result: any) => {
    if (result.payload) {
      return {payload: restJsonToPayloadResult(result.payload)};
    }
    return result;
  });
};

export default TaskMutationResult;