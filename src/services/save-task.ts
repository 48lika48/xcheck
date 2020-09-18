import { ITask } from 'src/models';

export const saveTask = (data: ITask) => {
  const text = JSON.stringify(data);
  const a = document.createElement('a');
  const file = new Blob([text], { type: '.json' });
  a.href = URL.createObjectURL(file);
  a.download = `${data.id || 'task'}.json`;
  a.click();
};
