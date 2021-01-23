import Actor from 'listlab-api/Actor';
import TaskCreationSource from 'listlab-api/TaskCreationSource';

export default class TaskCreationGroup {

  public readonly taskCreationGroupId: number;

  public readonly source: TaskCreationSource;

  public readonly owner: Actor;

  public readonly creationTime: Date;

  constructor(taskCreationGroupId: number, source: TaskCreationSource, owner: Actor, creationTime: Date) {
    this.taskCreationGroupId = taskCreationGroupId;
    this.source = source;
    this.owner = owner;
    this.creationTime = creationTime;
  }
}
