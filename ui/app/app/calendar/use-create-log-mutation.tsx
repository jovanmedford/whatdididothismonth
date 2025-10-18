import { showNotification } from "@/app/_components/toast/toast";
import { createActivityLog, deleteLog } from "@/app/_lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilterContext } from "./filter-context";
import { useAuthSession } from "@/app/_hooks/use-auth-session";

export default function useCreateActivityLogMutation() {
  const queryClient = useQueryClient();
  const { filters } = useFilterContext();
  const { token } = useAuthSession();

  return useMutation({
    mutationFn: (input: createLogInput) =>
      createActivityLog(
        { ...input, year: filters.year, month: filters.month },
        token
      ),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["logs", filters.year, filters.month],
      });
    },
    onError: (e) => {
      console.log("Error", e);
      showNotification({
        type: "error",
        title: "Could not create log.",
        description: e.message,
      });
    },
  });
}

type createLogInput = {
  label: string;
  target: number;
};
