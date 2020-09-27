import { ITask } from 'src/models';
import { defaultScore, defaultSubtask } from './TaskManager';

export const updateArray = (currentArray: string[], index: number, value: string): string[] => {
  const newArray = [...currentArray];
  newArray[index] = value;
  return currentArray;
};

export const updateSubtasks = (
  currentSubtasks: ITask['subtasks'] = defaultSubtask,
  category: string,
  index: number,
  value: string
): ITask['subtasks'] => {
  currentSubtasks[category] = [...currentSubtasks[category]];
  currentSubtasks[category][index] = value;
  return currentSubtasks;
};

export const updateScores = (
  currentScore: ITask['score'] = defaultScore,
  category: string,
  index: number,
  value: number
): ITask['score'] => {
  currentScore[category] = [...currentScore[category]];
  currentScore[category][index] = value;
  return currentScore;
};

export const updateMaxScore = (currentScore: ITask['score']): number => {
  const scoreArr = Object.values(currentScore || defaultScore).flat();
  const maxScore = scoreArr.reduce(
    (sum: number, current: number) => (current > 0 ? sum + current : sum),
    0
  );
  return maxScore;
};
