import authorizedRequest from 'listlab-api/authorizedRequest';
import {consumeTaskComment, consumeTaskComments} from 'listlab-api/commentSerialization';
import ListlabApiConfig from 'listlab-api/ListlabApiConfig';
import TaskComment from 'listlab-api/TaskComment';

export default class CommentClient {

  private readonly config: ListlabApiConfig;
  private readonly commentServiceAddress: string;

  constructor(config: ListlabApiConfig) {
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
