import { ActivityLog } from "@/app/_types/types";
import LogList from "./log-list";
import useLogs from "@/app/_hooks/use-logs";
import { useFilterContext } from "./filter-context";
import LogTable from "./log-table";
import { useMediaQuery } from "@/app/_hooks/use-media-query";

export default function LogManager() {
  const { filters } = useFilterContext();
  const { logStatus, logs } = useLogs(filters);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (logStatus === "pending") {
    return <p>...loading</p>;
  }

  if (logStatus === "error") {
    return <p>Error</p>;
  }

  console.log("matches", isDesktop)

  return (
    <>
      {isDesktop ? (
        <LogTable
          activityLogs={logs!}
          month={filters.month}
          year={filters.year}
        />
      ) : (
        <LogList
          activityLogs={logs!}
          month={filters.month}
          year={filters.year}
        />
      )}
    </>
  );
}

export interface LogViewProps {
  activityLogs: ActivityLog[];
  month: number;
  year: number;
}
