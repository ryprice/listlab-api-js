import {IPromise} from "q";

import authorizedRequest from "./authorizedRequest";
import TaskApiConfig from "./TaskApiConfig";
import TaskComment from "./TaskComment";

export default class CommentClient {

  private config: TaskApiConfig;
  private commentServiceAddress: string;

  constructor(config: TaskApiConfig) {
    this.config = config;
    this.commentServiceAddress = config.CommentServiceAddress;
  }

  getCommentsForTask(taskId: number): IPromise<TaskComment[]> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/task/${taskId}`,
      method: "GET"
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskComments);
  }

  postTaskComment(comment: TaskComment): IPromise<TaskComment> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/task`,
      method: "POST",
      data: JSON.stringify(comment),
      headers: {"Content-Type": "application/json"},
    };
    return authorizedRequest(this.config, ajaxSettings).then(consumeTaskComment);
  }


  deleteTaskComment(commentId: number): IPromise<void> {
    const ajaxSettings = {
      url: `${this.commentServiceAddress}/taskComment/${commentId}`,
      method: "DELETE",
    };
    return authorizedRequest(this.config, ajaxSettings);
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
    const entity = this.consumeTaskComment(json[i]);
    comments.push(entity);
  }
  return comments;
};
