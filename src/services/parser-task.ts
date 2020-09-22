import moment from 'moment';
import { message } from 'antd';
import { ITask } from 'src/models';
import {
  updateArray,
  updateSubtasks,
  updateMaxScore,
  updateScores,
} from '../forms/task-manager/steps/helpers';
import { defaultScore, defaultSubtask } from 'src/forms/task-manager/TaskManager';

const categories = ['basic', 'advanced', 'extra', 'fines'];
const successMsg = 'File uploaded successfully.';
const failedMsg = 'File upload failed.';
const failedMdFormatMsg =
  'Data format incompatible. Please fill in the missing information manually.';
const failedBigFileMsg = 'The file size is very large.';
const errorParsingMsg = 'File parsing error or invalid data format.';

type Args = {
  file: File;
  taskData: ITask;
  setTaskData: (field: string, value: any) => void;
};

type RSSCheckList = {
  taskName: string;
  github: string;
  information: string;
  criteria: RSSChecklistCriteria[];
};

type RSSChecklistCriteria = { type: string; title?: string; text?: string; max?: number };

export const parsTask = ({ file, taskData, setTaskData }: Args) => {
  if (file.size > 204800) {
    return showMessage(false, failedBigFileMsg);
  }

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = () => {
    const result = `${reader.result}` || '';

    try {
      if (/.json$/.test(file.name)) {
        const task = JSON.parse(result);
        const isRSSChecklist = task.hasOwnProperty('criteria');
        isRSSChecklist ? setRSSChecklistData(task) : setOwnFormatData(task);
      }

      if (/.md$/.test(file.name) && result) {
        parseMDData(result);
      }

      return showMessage(true, '');
    } catch (e) {
      showMessage(false, errorParsingMsg);
    }
  };

  reader.onerror = () => {
    showMessage(false, '');
  };

  const setRSSChecklistData = (task: RSSCheckList): void => {
    setTaskData('id', task.taskName);
    setTaskData('description', task.information);

    const criteriaTitles = task.criteria.filter((item: RSSChecklistCriteria): boolean => {
      return item.type === 'title';
    });

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
      setTaskData(
        'requirements',
        updateArray(taskData.requirements || [], index, criteria.title || '')
      );
      task.criteria
        .slice(titleIndex + 1, endIndex)
        .forEach((item: RSSChecklistCriteria, i: number) => {
          setTaskData(
            'subtasks',
            updateSubtasks(
              taskData.subtasks || { basic: [], advanced: [], extra: [], fines: [] },
              categories[index],
              i,
              item.text || ''
            )
          );
          setTaskData(
            'score',
            updateScores(taskData.score || defaultScore, categories[index], i, item.max || 0)
          );
          setTaskData('maxScore', updateMaxScore(taskData.score));
        });
    });
  };

  const setOwnFormatData = (task: ITask): void => {
    function instanceOfTask(object: any): object is ITask {
      return (
        object.id &&
        object.description !== undefined &&
        object.startDate &&
        object.endDate &&
        Array.isArray(object.goals) &&
        Array.isArray(object.requirements) &&
        'basic' in object.subtasks[0] &&
        'advanced' in object.subtasks[1] &&
        'extra' in object.subtasks[2] &&
        'fines' in object.subtasks[3] &&
        'basic' in object.score[0] &&
        'advanced' in object.score[1] &&
        'extra' in object.score[2] &&
        'fines' in object.score[3] &&
        object.maxScore !== undefined &&
        object.author !== undefined &&
        object.state !== undefined &&
        Array.isArray(object.categoriesOrder) &&
        Array.isArray(object.items)
      );
    }
    if (instanceOfTask(task)) {
      return setTaskData('allData', task);
    }
    throw Error;
  };

  const parseMDData = (result: string): any => {
    const id = result.match(/# +(.+)\s/);
    const description = result.match(/\|\n\n\s*(.+)\n\n/im);
    const endTime = result.match(/\|\s*(\d\d\.\d\d\.\d\d\d\d *\d\d:\d\d) *\| *.*? \|/m);
    const sections = [...result.matchAll(/\s*###\s+(.+\s+\+?\d.+)[^*]/gm)];
    const finesSection = result.match(/\n\s*###?\s+([ШF]{1}.+\s+)/im);
    finesSection && sections.push(finesSection);

    if (!sections.length) return message.error(failedMdFormatMsg);

    id && setTaskData('id', id[1].trim());
    description && setTaskData('description', description[1].split('*').join('').trim());
    endTime && setTaskData('endDate', moment(endTime[1], 'DD.MM.YYYY HH:mm').format());
    sections.forEach((section: any, index: number) => {
      setTaskData(
        'requirements',
        updateArray(taskData.requirements || [], index, section[1].trim() || '')
      );

      const subtasks = [
        ...result
          .slice(section.index, sections[index + 1] ? sections[index + 1].index : result.length)
          .matchAll(/-\s+[*[]+\s?[*\]]\s?(.+)([+-]\d+)/gm),
      ];
      subtasks.forEach((subtask: any, i: number) => {
        setTaskData(
          'subtasks',
          updateSubtasks(
            taskData.subtasks || defaultSubtask,
            categories[index],
            i,
            subtask[1] || ''
          )
        );
        setTaskData(
          'score',
          updateScores(taskData.score || defaultScore, categories[index], i, +subtask[2] || 0)
        );
        setTaskData('maxScore', updateMaxScore(taskData.score || defaultScore));
      });
    });
  };
};

function showMessage(isUploaded: boolean, addMessage: string): void {
  isUploaded ? message.success(successMsg) : message.error(`${failedMsg} ${addMessage}`);
}
