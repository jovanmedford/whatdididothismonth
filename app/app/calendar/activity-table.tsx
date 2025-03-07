"use client";

import { useQuery } from "@tanstack/react-query";
import { generateArray } from "@/app/utils";
import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Filters, useFilterContext } from "./filter-context";

const client = generateClient<Schema>();

const DateSquares = ({
  activityId = "activity",
  successes = [],
}: {
  activityId: string;
  successes: number[];
}) => {
  let indices = generateArray(0, 31);
  let successSet = new Set(successes);
  return (
    <div className="flex gap-4 w-40 m-auto md:w-full md:flex-wrap overflow-auto">
      {indices.map((index) => (
        <label
          key={`${activityId}-${index}`}
          className="checkbox-parent flex justify-center w-6"
        >
          {index}
          <input
            readOnly
            checked={successSet.has(index)}
            type="checkbox"
            name={activityId}
          ></input>
        </label>
      ))}
    </div>
  );
};

const Row = ({ activity }: { activity: Activity }) => {
  return (
    <tr tabIndex={0} className="h-20 border-b-1">
      <th className="w-6/12 md:w-4/12 border-r-1">
        {activity.name}{" "}
        <span className="text-xs font-normal">(0/{activity.target})</span>
      </th>
      <td className="w-6/12 md:w-8/12 overflow-x-auto">
        <DateSquares activityId={activity.id} successes={activity.successes} />
      </td>
    </tr>
  );
};

const fetchActivities = async (filters: Filters) => {
  const { data: items, errors } = await client.models.Activity.list();
  if (errors) {
    throw new Error(errors[0].message);
  }
  return items;
};

export default function ActivityTable() {
  const { filters } = useFilterContext();
  const { status, data, error } = useQuery({
    queryKey: ["activties", filters],
    queryFn: () => fetchActivities(filters),
  });

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <table className="w-full">
      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((activity: Activity) => (
            <Row key={activity.id} activity={activity}></Row>
          ))
        ) : (
          <p className="text-center mt-8 block">
            Whoops! No tracking data this month
          </p>
        )}
      </tbody>
    </table>
  );
}

interface Activity {
  id: string;
  userId: string;
  name: string;
  target: number;
  successes: number[];
}
