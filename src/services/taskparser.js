export const parsTask = (file) => {
  console.log(file);
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    console.log(reader.result);
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
};
