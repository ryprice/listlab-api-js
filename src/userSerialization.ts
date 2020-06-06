import MaybeUser from 'listlab-api/MaybeUser';
import User from 'listlab-api/User';
import UserDetails from 'listlab-api/UserDetails';
import {restParseInt, restParseString, restParseBool} from 'listlab-api/utils/restParamParsers';

export const restJsonToUser = (json: any): User => {
  const user = new User();
  user.userId = json.userId;
  user.name = json.name;
  user.username = json.username;
  user.isAnonymous = json.isAnonymous;
  return user;
};

export const restJsonToUsers = (json: any): User[] => {
  const users = new Array<User>();
  for (let i = 0; i < json.length; i++) {
    const entity = restJsonToUser(json[i]);
    users.push(entity);
  }
  return users;
};

export const restJsonToUserDetails = (json: any): UserDetails => {
  const userDetails = new UserDetails();
  userDetails.userId = restParseInt(json.userId);
  userDetails.name = restParseString(json.name);
  userDetails.email = restParseString(json.email);
  userDetails.settings = json.settings;
  userDetails.facebookId = restParseString(json.facebookId);
  userDetails.googleId = restParseString(json.googleId);
  userDetails.username = restParseString(json.username);
  userDetails.pendingEmail = restParseString(json.pendingEmail);
  userDetails.isAnonymous = restParseBool(json.isAnonymous);
  userDetails.gates = json.gates;
  return userDetails;
};

export const maybeUserToRestJson = (maybeUser: MaybeUser): Object => {
  if (maybeUser) {
    return {
      userId: maybeUser.userId,
      name: maybeUser.name,
    };
  }
};

export const restJsonToMaybeUser = (json: any) => {
  if (json) {
    return new MaybeUser(
      restParseInt(json.userId),
      restParseString(json.name)
    );
  } else {
    return new MaybeUser(null, null);
  }
};
