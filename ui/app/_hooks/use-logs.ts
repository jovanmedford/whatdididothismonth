import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "../_lib/api";
import { useAuthSession } from "./use-auth-session";
import { Filters } from "../app/calendar/filter-context";
import { ActivityLog } from "../_types/types";

export default function useLogs(filters: Filters) {
  const { token } = useAuthSession();
  const { status, data, error } = useQuery({
    queryKey: ["logs", filters.year, filters.month],
    queryFn: async () => fetchLogs(filters, token),
    enabled: !!token,
  });

  return { logStatus: status, logs: data, logError: error };
}
