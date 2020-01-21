import AuthSession from 'listlab-api/AuthSession';
import MaybeUser from 'listlab-api/MaybeUser';
import User from 'listlab-api/User';

export const consumeUser = (json: any): User => {
  const user = new User();
  user.userId = json.userId;
  user.name = json.name;
  user.username = json.username;
  user.isAnonymous = json.isAnonymous;
  return user;
};

export const consumeUsers = (json: any): User[] => {
  const users = new Array<User>();
  for (let i = 0; i < json.length; i++) {
    const entity = consumeUser(json[i]);
    users.push(entity);
  }
  return users;
};

export const consumeUserDetails = (json: any): AuthSession => {
  const userDetails = new AuthSession();
  userDetails.userId = json.userId;
  userDetails.name = json.name;
  userDetails.email = json.email;
  userDetails.settings = json.settings;
  userDetails.facebookId = json.facebookId;
  userDetails.googleId = json.googleId;
  userDetails.username = json.username;
  userDetails.pendingEmail = json.pendingEmail;
  userDetails.isAnonymous = json.isAnonymous;
  return userDetails;
};

export const generateMaybeUserJson = (maybeUser: MaybeUser): Object => {
  if (maybeUser) {
    return {
      userId: maybeUser.userId,
      name: maybeUser.name,
    };
  }
};

export const consumeMaybeUser = (json: any) => {
  if (json) {
    return new MaybeUser(json.userId, json.name);
  } else {
    return new MaybeUser(null, null);
  }
};
