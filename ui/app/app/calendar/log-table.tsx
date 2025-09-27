import { ActivityLog } from "@/app/_types/types";
import { LogViewProps } from "./log-manager";
import ProgressGrid from "@/app/_components/progress-grid/progress-grid";
import { daysInMonth } from "@/app/utils";

export default function LogTable({ activityLogs, month, year }: LogViewProps) {
  let numOfDays = daysInMonth(month, year);

  if (activityLogs.length == 0) {
    return <p>Whoops! No tracking data this month</p>;
  }

  return (
    <table className="w-full">
      <tbody>
        {activityLogs.map((log) => (
          <Row key={log.id} log={log} numOfDays={numOfDays} />
        ))}
      </tbody>
    </table>
  );
}

const Row = ({ log, numOfDays }: { log: ActivityLog; numOfDays: number }) => {
  return (
    <tr tabIndex={0} className="h-20 border-b-1">
      <td className="w-6/12 md:w-4/12 border-r-1 px-1">
        {log.activityName}
        <span className="text-xs font-normal">
          ({log.successes.length}/{log.target})
        </span>
      </td>
      <td className="w-6/12 md:w-8/12 overflow-x-auto px-2 py-2">
        <ProgressGrid
          className="flex gap-2 flex-wrap"
          numOfDays={numOfDays}
          successes={log.successes}
          activity={{ id: log.activityId, label: log.activityName }}
        />
      </td>
    </tr>
  );
};
