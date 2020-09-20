import moment from 'moment';
import { message } from 'antd';
import { ITask } from 'src/models';
import { updateArray, updateSubtasks, updateScore } from '../forms/task-manager/Steps/helpers';

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

type RSSChecklistCriteria = { type: string; title?: string; text?: string; max?: string };

const categories = ['basic', 'advanced', 'extra', 'fines'];

export const parsTask = ({ file, taskData, setTaskData }: Args) => {
  if (file.size > 204800) {
    return showMessage(false, 'The file size is very large.');
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
      showMessage(false, 'Error parsing file.');
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
            updateSubtasks(taskData.subtasks || [], categories[index], i, item.text || '')
          );
          setTaskData(
            'score',
            updateSubtasks(taskData.score || [], categories[index], i, item.max || '0')
          );
          setTaskData('maxScore', updateScore(taskData.score || []));
        });
    });
  };

  const setOwnFormatData = (task: ITask): void => {
    function instanceOfTask(object: any): object is ITask {
      return 'id' in object && 'description' in object;
    }
    if(instanceOfTask(task))
    console.log(instanceOfTask(task));
    setTaskData('allData', task);
  };

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

    id && setTaskData('id', id[1].trim());
    description && setTaskData('description', description[1].split('*').join('').trim());
    endTime && setTaskData('endDate', moment(endTime[1], 'DD.MM.YYYY HH:mm').format());
  };
};
function showMessage(isUploaded: boolean, addMessage: string): void {
  isUploaded
    ? message.success(`File uploaded successfully.`)
    : message.error(`File upload failed. ${addMessage}`);
}
