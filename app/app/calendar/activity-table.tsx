"use client";

import { useQuery } from "@tanstack/react-query";
import activities from "../../../mocks/activities.json";
import { ActivityItem } from "@/app/_types/types";

const generateArray = (start: number, end: number) => {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i + 1);
  }
  return arr;
};

const DateSquares = ({ activityId = "activity" }: { activityId: string }) => {
  let indices = generateArray(0, 31);
  return (
    <div className="flex gap-4 w-40 m-auto md:w-full md:flex-wrap overflow-auto">
      {indices.map((index) => (
        <label
          key={`${activityId}-index`}
          className="checkbox-parent flex justify-center w-6"
        >
          {index}
          <input type="checkbox" name={activityId}></input>
        </label>
      ))}
    </div>
  );
};

const Row = ({ activityItem }: { activityItem: ActivityItem }) => {
  return (
    <tr tabIndex={0} className="h-20 border-b-1">
      <th className="w-6/12 md:w-4/12 border-r-1">
        {activityItem.activity.name}{" "}
        <span className="text-xs font-normal">
          ({activityItem.totals.completed}/{activityItem.activity.target})
        </span>
      </th>
      <td className="w-6/12 md:w-8/12 overflow-x-auto">
        <DateSquares activityId={activityItem.activity.id} />
      </td>
    </tr>
  );
};

export default function ActivityTable() {
  const { status, data, error } = useQuery({
    queryKey: ["activties"],
    queryFn: async () => {
      return activities;
    },
  });

  

  if (status === "pending") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <table className="w-full">
      <tbody>
        {data.map((activityItem) => (
          <Row key={activityItem.activity.id} activityItem={activityItem}></Row>
        ))}
      </tbody>
    </table>
  );
}
