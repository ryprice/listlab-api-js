import authorizedRequest from 'ququmber-api/authorizedRequest';
import TaskApiConfig from 'ququmber-api/TaskApiConfig';
import TaskComment from 'ququmber-api/TaskComment';

export default class CommentClient {

  private config: TaskApiConfig;
  private commentServiceAddress: string;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.commentServiceAddress = config.CommentServiceAddress;
  }

  async getCommentsForTask(taskId: number): Promise<TaskComment[]> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/task/${taskId}`,
      method: 'GET'
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskComments);
  }

  async postTaskComment(comment: TaskComment): Promise<TaskComment> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/task`,
      method: 'POST',
      data: JSON.stringify(comment),
      headers: {'Content-Type': 'application/json'},
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskComment);
  }


  async deleteTaskComment(commentId: number): Promise<void> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/taskComment/${commentId}`,
      method: 'DELETE',
    };
    await authorizedRequest(this.config, ajaxSettings);
  }
}

export const consumeTaskComment = (json: any): TaskComment => {
  const comment = new TaskComment();
  comment.commentId = json.commentId;
  comment.taskId = json.taskId;
  comment.userId = json.userId;
  comment.text = json.text;
  comment.time = new Date(json.time);
  return comment;
};

export const consumeTaskComments = (json: any): TaskComment[] => {
  const comments = new Array<TaskComment>();
  for (let i = 0; i < json.length; i++) {
    const entity = consumeTaskComment(json[i]);
    comments.push(entity);
  }
  return comments;
};
