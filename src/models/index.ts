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
  disputes = 'disputes',
}

export type DataTypes = IUser | ITask | ICheckSession | IReviewRequest | IReview | IDispute;

export enum UserRole {
  author = 'author',
  student = 'student',
  supervisor = 'supervisor',
  course_manager = 'course_manager',
}

export interface IUser {
  id: string;
  githubId: string;
  roles: UserRole[];
}

export interface ITask {
  id: string;
  description: string;
  author?: string;
  state: TaskState;
  startDate?: string;
  endDate?: string;
  goals?: string[];
  categoriesOrder?: TaskCategory[];
  requirements?: string[];
  items?: ITaskItem[];
  subtasks?: {
    basic: Array<string | undefined>;
    advanced: Array<string | undefined>;
    extra: Array<string | undefined>;
    fines: Array<string | undefined>;
  };
  score?: { basic: number[]; advanced: number[]; extra: number[]; fines: number[] };

  maxScore?: 0;
}

export enum TaskState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum TaskCategory {
  Basic = 'Basic Scope',
  Extra = 'Extra Scope',
  Fines = 'Fines',
}

export interface ITaskItem {
  id: string;
  minScore: number;
  maxScore: number;
  category: TaskCategory;
  title: string;
  description: string;
}

export interface ICheckSession {
  id: string;
  state: CrossCheckSessionState;
  taskId: string;
  coefficient: number;
  startDate: Date;
  endDate: Date;
  discardMinScore: true;
  discardMaxScore: false;
  minReviewsAmount: number;
  desiredReviewersAmount: number;
  attendees: ICheckSessionAttendee[];
}

export enum CrossCheckSessionState {
  DRAFT = 'DRAFT',
  REQUESTS_GATHERING = 'REQUESTS_GATHERING',
  CROSS_CHECK = 'CROSS_CHECK',
  COMPLETED = 'COMPLETED',
}

export interface ICheckSessionAttendee {
  githubId: string;
  reviewerOf: string[];
}

export interface IReviewRequest {
  id: string;
  crossCheckSessionId: string | null;
  author: string;
  task: string;
  state: ReviewRequestState;
  selfGrade: ITaskScore | null;
  url: string;
  urlPR: string;
}

export enum ReviewRequestState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
}

export interface IReview {
  id: string;
  requestId: string;
  author: string;
  state: ReviewState;
  grade: ITaskScore;
  reviewedStudent?: String;
  task?: String;
}

export interface ITaskScore {
  task: string;
  items: Array<ITaskScoreItem>;
}

export interface ITaskScoreItem {
  id: string;
  score: number;
  comment: string;
}

export enum ReviewState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DISPUTED = 'DISPUTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface IDispute {
  id: string;
  reviewId: string | undefined;
  state: DisputeState;
  item: string;
  comment: string;
  suggestedScore: number;
}

export enum DisputeState {
  ONGOING = 'ONGOING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
