import ProgressGrid from "@/app/_components/progress-grid/progress-grid";
import { LogViewProps } from "./log-manager";
import { daysInMonth } from "@/app/utils";

export default function LogList({ activityLogs, month, year }: LogViewProps) {
  let numOfDays = daysInMonth(month, year);

  if (activityLogs.length == 0) {
    return <p>Whoops! No tracking data this month</p>;
  }

  return (
    <ul className="block pt-4">
      {activityLogs.map((log) => (
        <li key={log.id} className="max-w-108 mx-auto mb-4">
          <h2 className="mb-1">
            {log.activityName}{" "}
            <span className="text-xs font-normal">
              {log.successes.length}/{log.target}
            </span>
          </h2>
          <div>
            <ProgressGrid
              className="grid grid-cols-7 gap-y-4"
              numOfDays={numOfDays}
              successes={log.successes}
              activity={{ id: log.activityId, label: log.activityName }}
            
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
