import {fuzzyTimeRangeToRestJson, restJsonToFuzzyTimeRange} from 'listlab-api/fuzzyTimeSerialization';
import TaskFilter from 'listlab-api/TaskFilter';
import {restParseBool, restParseInt, restParseString} from 'listlab-api/utils/restParamParsers';

export const restJsonToTaskFilter = (json: any): TaskFilter => {
  if (json == null) {
    return null;
  }

  const initArgs: any = {};

  if (json.parentId != null) {
    initArgs.parentId = restParseInt(json.parentId);
  }
  if (json.listId != null) {
    initArgs.listId = restParseInt(json.listId);
  }
  if (json.completed != null) {
    initArgs.completed = restParseBool(json.completed);
  }
  if (json.inProgress != null) {
    initArgs.inProgress = restParseBool(json.inProgress);
  }
  if (json.query != null) {
    initArgs.query = restParseString(json.query);
  }
  if (json.range != null) {
    initArgs.range = restJsonToFuzzyTimeRange(json.range);
  }
  if (json.seen != null) {
    initArgs.seen = restParseBool(json.seen);
  }
  if (json.isLeaf != null) {
    initArgs.isLeaf = restParseBool(json.isLeaf);
  }
  if (json.isRoot != null) {
    initArgs.isRoot = restParseBool(json.isRoot);
  }
  if (json.inbox != null) {
    initArgs.inbox = restParseBool(json.inbox);
  }

  return new TaskFilter(initArgs);
};

export const taskFilterToRestJson = (filter: TaskFilter): Object => ({
  ...filter,
  ...(filter.range ? {range: fuzzyTimeRangeToRestJson(filter.range)} : {})
});
