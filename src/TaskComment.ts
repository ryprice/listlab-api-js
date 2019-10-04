export default class TaskComment {
  public commentId: number;
  public taskId: number;
  public userId: number;
  public text: string;
  public time: Date;

  clone() {
    const newTaskComment = new TaskComment();
    newTaskComment.commentId = this.commentId;
    newTaskComment.taskId = this.taskId;
    newTaskComment.userId = this.userId;
    newTaskComment.text = this.text;
    newTaskComment.time = this.time;
    return newTaskComment;
  }
}
