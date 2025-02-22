const generateArray = (start: number, end: number) => {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i + 1);
  }
  return arr;
};

const DateSquares = ({ activity = "activity" }: { activity: string }) => {
  let indices = generateArray(0, 31);
  return (
      <div className="flex gap-4 w-40 m-auto md:w-full md:flex-wrap overflow-auto">
        {indices.map((index) => (
          <label className="checkbox-parent flex justify-center w-6">
            {index}
            <input type="checkbox" name={activity}></input>
          </label>
        ))}
      </div>
  );
};

export default function ActivityTable() {
  return (
    <table className="w-full">
      <tbody>
        <tr tabIndex={0} className="h-20 border-b-1">
          <th className="w-6/12 md:w-4/12 border-r-1">
            Walk 10,000 Steps{" "}
            <span className="text-xs font-normal">(10/20)</span>
          </th>
          <td className="w-6/12 md:w-8/12 overflow-x-auto">
            <DateSquares activity="walking" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
