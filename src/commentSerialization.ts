import TaskComment from 'listlab-api/TaskComment';
import {restParseInt, restParseString, restParseDate} from 'listlab-api/utils/restParamParsers';

export const restJsonToTaskComment = (json: any): TaskComment => {
  const comment = new TaskComment();
  comment.commentId = restParseInt(json.commentId);
  comment.taskId = restParseInt(json.taskId);
  comment.userId = restParseInt(json.userId);
  comment.text = restParseString(json.text);
  comment.time = restParseDate(json.time);
  return comment;
};

export const restJsonToTaskComments = (json: any): TaskComment[] => {
  const comments = new Array<TaskComment>();
  for (let i = 0; i < json.length; i++) {
    const entity = restJsonToTaskComment(json[i]);
    comments.push(entity);
  }
  return comments;
};
