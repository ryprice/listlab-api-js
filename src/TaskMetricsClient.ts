import authorizedRequest from 'listlab-api/authorizedRequest';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';

export type LifecycleCountsResult = {
  completed: {key: string, value: number}[],
  created: {key: string, value: number}[],
};

const consumeLifecycleCountResult = (data: any): LifecycleCountsResult => {
  const completed = data.completed.map((d: any) => ({
    key: d.key,
    value: d.value,
  }));
  const created = data.created.map((d: any) => ({
    key: d.key,
    value: d.value,
  }));
  return {completed, created};
};

export default class TaskClient {

  private readonly config: ListlabApiConfig;

  private readonly taskServiceAddress: string;

  constructor(config: ListlabApiConfig) {
    this.taskServiceAddress = config.TaskServiceAddress;
    this.config = config;
  }

  async getLifecycleCounts(): Promise<LifecycleCountsResult> {
    const ajaxSettings = {
      url: `${this.taskServiceAddress}/metrics/lifecycle-counts`,
      method: 'GET'
    };
    const json = await authorizedRequest(this.config, ajaxSettings);
    return consumeLifecycleCountResult(json);
  }
}