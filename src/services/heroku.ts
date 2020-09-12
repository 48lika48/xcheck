import { HEROKU_URL } from '../constants';
import {
  Endpoint,
  ITask,
  DataTypes,
  IUser,
  ICheckSession,
  UserRole,
  IReviewRequest,
  IReview,
} from 'src/models';
import { getGithubLogin } from './github-auth';

export const getUsers = async () => {
  const res = await getData(Endpoint.users);
  return res;
};

export const addUser = async (user: IUser) => {
  const res = await addData(Endpoint.users, user);
  return res;
};

export const setUserRoles = (userId: string, roles: UserRole[]) => {
  fetch(`${HEROKU_URL}users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ roles }),
  });
};

export const getTasks = async () => {
  const res = await getData(Endpoint.tasks);
  return res;
};

export const addTask = async (task: ITask) => {
  const res = await addData(Endpoint.tasks, task);
  return res;
};

export const getCheckSessions = async () => {
  const res = await getData(Endpoint.checkSessions);
  return res;
};

export const addCheckSession = async (checkSession: ICheckSession) => {
  const res = await addData(Endpoint.checkSessions, checkSession);
  return res;
};

export const getReviewRequests = async () => {
  const res = await getData(Endpoint.reviewRequests);
  return res;
};

export const addReviewRequest = async (reviewRequest: IReviewRequest) => {
  const res = await addData(Endpoint.reviewRequests, reviewRequest);
  return res;
};

export const getReviews = async () => {
  const res = await getData(Endpoint.reviews);
  return res;
};

export const addReview = async (review: IReview) => {
  const res = await addData(Endpoint.reviews, review);
  return res;
};

export const getData = async (endpoint: Endpoint) => {
  const res = await fetch(HEROKU_URL + endpoint);
  return res;
};

export const addData = async (endpoint: Endpoint, data: DataTypes) => {
  const resolve = await fetch(HEROKU_URL + endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return resolve;
};

export const checkUser = async () => {
  const usersRes = await getUsers();
  const users = await usersRes.json();
  const githubLogin = getGithubLogin();
  const user = users.find((user: { githubId: string }) => user.githubId === githubLogin);
  if (!user) {
    registerUser(githubLogin, users);
    return true;
  }

  const role = localStorage.role || 'student';
  if (!user.roles.includes(role)) {
    user.roles.push(role);
    setUserRoles(user.id, user.roles);
  }
  return true;
};

const registerUser = async (githubLogin: string, users: IUser[]) => {
  const lastIdNumber = users.length
    ? +users.reduce((maxId, user) => {
        const userId = user.id.includes('user-') ? +user.id.split('user-')[1] : 0;
        return userId > maxId ? userId : maxId;
      }, 0)
    : 0;
  const user = {
    id: `user-${lastIdNumber + 1}`,
    githubId: githubLogin,
    roles: [localStorage.role || 'student'],
  };
  addUser(user);
};
