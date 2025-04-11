"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateArray } from "@/app/utils";
import { Filters, useFilterContext } from "./filter-context";
import {
  AuthSession,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { showNotification } from "@/app/_components/toast/toast";
import { Activity } from "@/app/_types/types";

const addSuccess = async ({
  activity,
  successIndex,
}: {
  activity: Activity;
  successIndex: number;
}) => {
  return {};
};

const DateSquares = ({ activity }: { activity: Activity }) => {
  let indices = generateArray(0, 31);
  const { filters } = useFilterContext();
  console.log(activity);
  let successSet = new Set(activity.successes);

  const queryClient = useQueryClient();

  let mutation = useMutation({
    mutationFn: addSuccess,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["activties", filters.year, filters.month, activity.sk],
      });
    },
    onError: (e) => {
      showNotification({
        type: "error",
        title: "Could not update your progress.",
        description: "Please try again.",
      });
      console.log(e.message);
    },
  });

  return (
    <div className="flex gap-4 w-40 m-auto md:w-full md:flex-wrap overflow-auto">
      {indices.map((index) => (
        <label
          key={`${activity}-${index}`}
          className="checkbox-parent flex justify-center w-6"
        >
          {index}
          <input
            readOnly
            data-index={index}
            checked={successSet.has(index)}
            type="checkbox"
            name={activity.sk}
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
        {activity.activityName}
        <span className="text-xs font-normal">(0/{activity.target})</span>
      </th>
      <td className="w-6/12 md:w-8/12 overflow-x-auto">
        <DateSquares activity={activity} />
      </td>
    </tr>
  );
};

const fetchActivities = async (
  filters: Filters,
  session?: AuthSession,
  userId?: string
) => {
  if (!userId || !session || !session.tokens?.idToken) {
    console.log("Not signed in");
    return [];
  }

  let params = new URLSearchParams();
  params.set("year", String(filters.year));
  params.set("month", String(filters.month));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/activities?${params.toString()}`,
    {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: session.tokens.idToken.toString(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    throw Error;
  }

  return response.json();
};

export default function ActivityTable() {
  const { filters } = useFilterContext();

  let { data: session, status: testStatus } = useQuery<AuthSession>({
    queryKey: ["session"],
    queryFn: async () => await fetchAuthSession(),
  });

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const userId = userData?.userId;

  const { status, data, error } = useQuery({
    queryKey: ["activties", filters.year, filters.month, userData?.userId],
    queryFn: () => fetchActivities(filters, session, userId),
    enabled: !!userId,
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
            <Row key={`${activity.sk}`} activity={activity}></Row>
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
