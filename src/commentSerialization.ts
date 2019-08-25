import TaskComment from 'ququmber-api/TaskComment';

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
