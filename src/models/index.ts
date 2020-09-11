export interface IGithubInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  name: string;
  html_url: string;
}

export enum Endpoint {
  users = 'users',
  tasks = 'tasks',
  checkSessions = 'checkSessions',
  reviewRequests = 'reviewRequests',
  reviews = 'reviews',
}

export enum TaskState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum Category {
  Basic = 'Basic Scope',
  Extra = 'Extra Scope',
  Fines = 'Fines',
}

export enum UserRole {
  author = 'author',
  student = 'student',
  supervisor = 'supervisor',
  courseManager = 'course_manager',
}

export type DataTypes = IUser | ITask | ICheckSession;

export interface ITaskItem {
  id: string;
  minScore: number;
  maxScore: number;
  category: Category;
  title: string;
  description: string;
}

export interface IUser {
  id: string;
  githubId: string;
  roles: UserRole[];
}

export interface ITask {
  id: string;
  author: string;
  state: TaskState;
  categoriesOrder: Category[];
  items: ITaskItem[];
}

export interface ICheckSessionAttendee {
  githubId: string;
  reviewOf: string[];
}

export interface ICheckSession {
  id: string;
  state: TaskState;
  taskId: string;
  coefficient: number;
  startDate: Date;
  endDate: Date;
  discardMinScore: true;
  discardMaxScore: false;
  minReiewsAmount: number;
  desiredReviewersAmount: number;
  attendees: ICheckSessionAttendee[];
}
