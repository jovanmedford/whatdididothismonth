export const generateArray = (start: number, end: number) => {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i + 1);
  }
  return arr;
};
