export const parsTask = (file: File, onDataChange: (field: string, value: any) => void) => {
  console.log(file);
  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const result = reader.result || null;

    if (/.json$/.test(file.name)) {
      const task = JSON.parse(result as string);
      console.log(task);
      onDataChange('id', task.taskName);
      onDataChange('description', task.information);
      return true;
    }
    if (/.md$/.test(file.name)) {
      const id = '';
      const description = '';

      onDataChange('id', id);
      onDataChange('description', description);
      return true;
    }
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
};
