import { ActivityLog } from "@/app/_types/types";
import LogView, { LogContainerRenderer, LogItemRenderer } from "./log-view";

/**
 * Renders table view of activity logs
 */
export default function LogTable({
  activityLogs,
}: {
  activityLogs: ActivityLog[];
}) {
  return (
    <LogView
      activityLogs={activityLogs}
      itemRenderer={Row}
      containerRenderer={Table}
    />
  );
}

const Table: LogContainerRenderer = ({ children }) => {
  return (
    <table className="w-full">
      <tbody>{children}</tbody>
    </table>
  );
};

const Row: LogItemRenderer = ({ log, onSelected, isSelected, children }) => {
  return (
    <tr
      tabIndex={0}
      className={`h-20  ${
        isSelected
          ? "border-b-2 border-primary-100 bg-primary-100"
          : "border-b-2 border-gray-200 "
      }`}
    >
      <td
        data-log-id={log.id}
        className={`
          w-6/12 md:w-4/12 border-r-1 px-1 
          hover:cursor-pointer
          ${isSelected && "bg-primary-100"}
          ${!isSelected && "hover:bg-gray-100"}
          `}
        onClick={onSelected}
      >
        {log.activityName}
        <span className="text-xs font-normal">
          ({log.successes.length}/{log.target})
        </span>
      </td>
      <td className={`w-6/12 md:w-8/12 overflow-x-auto px-2 py-2`}>
        {children}
      </td>
    </tr>
  );
};
