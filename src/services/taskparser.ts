import moment from 'moment';

type Args = {
  file: File;
  onDataChange: (field: string, value: any) => void;
  showMessage: (isUploaded: boolean) => void;
};

export const parsTask = ({ file, onDataChange, showMessage }: Args) => {
  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = () => {
    const result = `${reader.result}` || '';
    // console.log(result);
    try {
      if (/.json$/.test(file.name)) {
        const task = JSON.parse(result as string);
        onDataChange('id', task.taskName);
        onDataChange('description', task.information);
      }

      if (/.md$/.test(file.name) && result) {
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

        onDataChange('id', id && id[1].trim());
        onDataChange('description', description && description[1].split('*').join('').trim());
        onDataChange('endDate', moment(endTime && endTime[1], 'DD.MM.YYYY HH:mm').format());
      }
      return showMessage(true);
    } catch (e) {
      showMessage(false);
      console.log(e);
    }
  };

  reader.onerror = () => {
    showMessage(false);
    console.log(reader.error);
  };
};
