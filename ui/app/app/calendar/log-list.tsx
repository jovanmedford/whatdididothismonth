import { ActivityLog } from "@/app/_types/types";
import LogView, { LogContainerRenderer, LogItemRenderer } from "./log-view";
import Button from "@/app/_components/button/button";
import { Ellipsis } from "lucide-react";
import { CircleCheck } from "lucide-react";

/**
 * Renders list view of activity logs
 */
export default function LogList({
  activityLogs,
}: {
  activityLogs: ActivityLog[];
}) {
  return (
    <LogView
      activityLogs={activityLogs}
      itemRenderer={ListItem}
      containerRenderer={ListContainer}
    />
  );
}

const ListContainer: LogContainerRenderer = ({ children }) => {
  return <ul className="block pt-4 mx-4">{children}</ul>;
};

const ListItem: LogItemRenderer = ({
  log,
  children,
  onSelected,
  isSelected,
}) => {
  return (
    <li
      key={log.id}
      className={`max-w-108 mx-auto mt-4 mb-8 px-4 py-3 rounded-lg ${isSelected ? "bg-primary-100" : ""}`}
      onClick={onSelected}
    >
      <div className={`py-2 flex justify-between `}>
        <div className="flex items-center gap-2">
          <h2 className="font-bold">{log.activityName} </h2>
          <span className="text-xs font-normal">
            {log.successes.length}/{log.target}
          </span>
        </div>
        {isSelected ? (
          <Button size="small" icon={CircleCheck} />
        ) : (
          <Button onClick={(e) => e.stopPropagation()} size="small" icon={Ellipsis} />
        )}
      </div>

      <div>{children}</div>
    </li>
  );
};
