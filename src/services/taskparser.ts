import moment from 'moment';
import { updateArray, updateSubtasks, updateScore } from '../forms/task-manager/Steps/helpers';

type Args = {
  file: File;
  taskData: any;
  onDataChange: (field: string, value: any) => void;
  showMessage: (isUploaded: boolean) => void;
};

type RSSCheckList = {
  taskName: string;
  github: string;
  information: string;
  criteria: RSSChecklistCriteria[];
};

type RSSChecklistCriteria = { type: string; title?: string; text?: string; max?: string };

const categories = ['basic', 'advanced', 'extra', 'fines'];

export const parsTask = ({ file, taskData, onDataChange, showMessage }: Args) => {
  const reader = new FileReader();
  reader.readAsText(file);

  const setRSSChecklistData = (task: RSSCheckList): void => {
    onDataChange('id', task.taskName);
    onDataChange('description', task.information);

    const criteriaTitles = task.criteria.filter((item: RSSChecklistCriteria): boolean => {
      return item.type === 'title';
    });

    console.log(criteriaTitles);

    criteriaTitles.forEach((criteria: RSSChecklistCriteria, index: number): void => {
      const titleIndex = task.criteria.findIndex((item: RSSChecklistCriteria): boolean => {
        return !!item.title && item.title === criteria.title;
      });

      const endIndex =
        index + 1 < criteriaTitles.length
          ? task.criteria.findIndex(
              (item: RSSChecklistCriteria): boolean =>
                item.title === criteriaTitles[index + 1].title
            )
          : task.criteria.length;
      onDataChange('requirements', updateArray(taskData.requirements, index, criteria.title || ''));
      task.criteria
        .slice(titleIndex + 1, endIndex)
        .forEach((item: RSSChecklistCriteria, i: number) => {
          onDataChange(
            'subtasks',
            updateSubtasks(taskData.subtasks, categories[index], i, item.text || '')
          );
          onDataChange(
            'score',
            updateSubtasks(taskData.score, categories[index], i, item.max || '0')
          );
          onDataChange('maxScore', updateScore(taskData.score));
        });
      console.log(titleIndex, endIndex);
    });
  };

  const setOwnFormatData = (task: any): void => {};

  const parseMDData = (result: string): void => {
    const id = result.match(/# +(.+)\s/);
    const description = result.match(/\n([*]?[a-zа-я*,. -]+)\n/im);
    const endTime = result.match(/\|\s*(\d\d\.\d\d\.\d\d\d\d *\d\d:\d\d) *\| *.*? \|/m);
    console.log(
      'id=',
      id && id[1].trim(),
      ', description=',
      description && description[1],
      ', endTime=',
      endTime && endTime[1]
    );

    id && onDataChange('id', id[1].trim());
    description && onDataChange('description', description[1].split('*').join('').trim());
    endTime && onDataChange('endDate', moment(endTime[1], 'DD.MM.YYYY HH:mm').format());
  };

  reader.onload = () => {
    const result = `${reader.result}` || '';
    console.log(result);
    try {
      if (/.json$/.test(file.name)) {
        const task = JSON.parse(result);
        const isRSSChecklist = task.hasOwnProperty('criteria');
        isRSSChecklist ? setRSSChecklistData(task) : setOwnFormatData(task);
      }

      if (/.md$/.test(file.name) && result) {
        parseMDData(result);
      }

      return showMessage(true);
    } catch (e) {
      showMessage(false);
    }
  };

  reader.onerror = () => {
    showMessage(false);
  };
};
