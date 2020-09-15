export const updateArray = (currentArray: string[], index: number, value: string, ): string[] => {
    currentArray[index]=value;
    return currentArray;
  }


export const updateSubtasks = (currentSubtasks: any[], category: string, index: number, value: string): object[] => {
  switch (category) {
    case 'basic':
      currentSubtasks[0].basic[index]=value;
      break;
    case 'advanced':
      currentSubtasks[1].advanced[index]=value;
      break;
    case 'extra':
      currentSubtasks[2].extra[index]=value;
      break;
    case 'fines':
        currentSubtasks[3].fines[index]=value;
      break;
    default:
      break;
  }
    return currentSubtasks;
  }
