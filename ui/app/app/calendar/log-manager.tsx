import LogList from "./log-list";
import useLogs from "@/app/_hooks/use-logs";
import { useFilterContext } from "./filter-context";
import LogTable from "./log-table";
import { useMediaQuery } from "@/app/_hooks/use-media-query";

/**
 * Fetches log data and manages view
 */
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

  return (
    <>
      {isDesktop ? (
        <LogTable activityLogs={logs!} />
      ) : (
        <LogList activityLogs={logs!} />
      )}
    </>
  );
}
