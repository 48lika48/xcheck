export interface GithubInfo {
  name: string;
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

export type DataTypes = User | Task;

export interface TaskItem {
  id: string;
  minScore: number;
  maxScore: number;
  category: Category;
  title: string;
  description: string;
}

export interface User {
  githubId: 'string';
  id: 'string';
  roles: string[];
}

export interface Task {
  id: string;
  author: string;
  state: TaskState;
  categoriesOrder: Category[];
  items: TaskItem[];
}
