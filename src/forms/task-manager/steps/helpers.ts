import { ITask } from 'src/models';
import { defaultScore, defaultSubtask } from '../TaskManager';

export const updateArray = (currentArray: string[], index: number, value: string): string[] => {
  currentArray[index] = value;
  return currentArray;
};

export const updateSubtasks = (
  currentSubtasks: ITask['subtasks'] = defaultSubtask,
  category: string,
  index: number,
  value: string
): {} => {
  switch (category) {
    case 'basic':
      currentSubtasks.basic[index] = value;
      break;
    case 'advanced':
      currentSubtasks.advanced[index] = value;
      break;
    case 'extra':
      currentSubtasks.extra[index] = value;
      break;
    case 'fines':
      currentSubtasks.fines[index] = value;
      break;
  }
  return currentSubtasks;
};

export const updateScores = (
  currentScore: ITask['score'] = defaultScore,
  category: string,
  index: number,
  value: number
): {} => {
  switch (category) {
    case 'basic':
      currentScore.basic[index] = +value;
      break;
    case 'advanced':
      currentScore.advanced[index] = +value;
      break;
    case 'extra':
      currentScore.extra[index] = +value;
      break;
    case 'fines':
      currentScore.fines[index] = +value;
      break;
  }
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
