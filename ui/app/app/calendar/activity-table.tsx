"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { daysInMonth } from "@/app/utils";
import { Filters, useFilterContext } from "./filter-context";
import { AuthSession, fetchAuthSession } from "aws-amplify/auth";
import { showNotification } from "@/app/_components/toast/toast";
import { ActivityLog } from "@/app/_types/types";
import { useAuthSession } from "@/app/_hooks/use-auth-session";
import ProgressGrid from "@/app/_components/progress-grid/progress-grid";

const DateSquares = ({ activity }: { activity: ActivityLog }) => {
  const { filters } = useFilterContext();
  let { month, year } = filters;
  let numOfDays = daysInMonth(month, year);
  let successSet = new Set(activity.successes);

  const queryClient = useQueryClient();

  let { data: session } = useQuery<AuthSession>({
    queryKey: ["session"],
    queryFn: async () => await fetchAuthSession(),
  });

  let mutation = useMutation({
    mutationFn: ({ day, session }: { day: number; session?: AuthSession }) =>
      toggleSuccess(!successSet.has(day), activity.id, day, session),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["activityLogs", filters.year, filters.month],
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
    <div className="w-40 m-auto md:w-full px-2">
      <ProgressGrid
        className="gap-2 flex-wrap"
        numOfDays={numOfDays}
        successes={activity.successes}
        activity={{ id: activity.activityId, label: activity.activityName }}
        onToggleSuccess={(e) => {
          mutation.mutate({ day: Number(e.target.value), session });
        }}
      />
    </div>
  );
};

const Row = ({ activity }: { activity: ActivityLog }) => {
  return (
    <tr tabIndex={0} className="h-20 border-b-1">
      <th className="w-6/12 md:w-4/12 border-r-1 px-1">
        {activity.activityName}
        <span className="text-xs font-normal">
          ({activity.successes.length}/{activity.target})
        </span>
      </th>
      <td className="w-6/12 md:w-8/12 overflow-x-auto">
        <DateSquares activity={activity} />
      </td>
    </tr>
  );
};

const fetchActivities = async (filters: Filters, token?: string) => {
  if (!token) {
    console.log("Not signed in");
    return [];
  }

  let params = new URLSearchParams();
  params.set("year", String(filters.year));
  params.set("month", String(filters.month));

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/activity-logs?${params.toString()}`,
    {
      mode: "cors",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    throw Error;
  }

  return response.json();
};

const toggleSuccess = async (
  shouldAdd: boolean,
  activityLogId: string,
  day: number,
  session?: AuthSession
) => {
  if (!session || !session.tokens?.idToken) {
    console.log("Not signed in");
    return [];
  }

  console.log(shouldAdd, day);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/success-logs`,
    {
      mode: "cors",
      method: shouldAdd ? "POST" : "DELETE",
      headers: {
        Authorization: session.tokens.idToken.toString(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ activityLogId, day }),
    }
  );

  if (!response.ok) {
    throw Error;
  }
};

export default function ActivityTable() {
  const { filters } = useFilterContext();
  const { token } = useAuthSession();

  const { status, data, error } = useQuery({
    queryKey: ["activityLogs", filters.year, filters.month],
    queryFn: () => fetchActivities(filters, token),
    enabled: !!token,
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
          data.map((activity: ActivityLog) => (
            <Row key={`${activity.activityId}`} activity={activity}></Row>
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
