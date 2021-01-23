import TaskCreationGroup from 'listlab-api/TaskCreationGroup';
import {restJsonToTaskCreationSource, taskCreationSourceToRestJson} from 'listlab-api/TaskCreationSource';
import {actorToRestJson, restJsonToActor} from 'listlab-api/userSerialization';
import {restParseDate, restParseInt} from 'listlab-api/utils/restParamParsers';

export const restJsonToTaskCreationGroup = (json: any) => {
  return new TaskCreationGroup(
    restParseInt(json.taskCreationGroupId),
    restJsonToTaskCreationSource(json.source),
    restJsonToActor(json.owner),
    restParseDate(json.creationTime),
  );
};

export const taskCreationGroupToRestJson = (tcg: TaskCreationGroup) => {
  return {
    taskCreationGroupId: tcg.taskCreationGroupId,
    source: taskCreationSourceToRestJson(tcg.source),
    owner: actorToRestJson(tcg.owner),
    creationTime: tcg.creationTime.toUTCString(),
  };
};