"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateArray, getDbClient } from "@/app/utils";
import { Filters, useFilterContext } from "./filter-context";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";

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

const fetchActivities = async (filters: Filters, userId: string) => {
  const docClient = getDbClient();

  if (!docClient) {
    console.log("Db client is not available");
    return [];
  }

  const command = new QueryCommand({
    TableName: "Activity-aqifu6gcxnc4hburjj2wfxjnwu-NONE",
    KeyConditionExpression: "userId = :userId and begins_with(#sk, :period)",
    ExpressionAttributeNames: {
      "#sk": "period#name",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":period": `${filters.year}#${filters.month}`,
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Items as Activity[];
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default function ActivityTable() {
  const { filters } = useFilterContext();

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const userId = userData?.userId;

  const { status, data, error } = useQuery({
    queryKey: ["activties", filters.year, filters.month, userData?.userId],
    queryFn: () => fetchActivities(filters, userId),
    enabled: !!userId
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
            <Row key={`${activity.userId}-${activity["period#name"]}`} activity={activity}></Row>
          ))
        ) : (
          <tr>
            <td className="text-center mt-8 block">
              Whoops! No tracking data this month
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

interface Activity {
  userId: string;
  "period#name": string;
  name: string;
  target: number;
  successes: number[];
}
