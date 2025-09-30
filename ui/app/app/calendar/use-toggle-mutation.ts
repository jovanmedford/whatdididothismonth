import { showNotification } from "@/app/_components/toast/toast";
import { toggleSuccess } from "@/app/_lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilterContext } from "./filter-context";
import { useAuthSession } from "@/app/_hooks/use-auth-session";

export default function useToggleMutation() {
  const queryClient = useQueryClient();
  const { filters } = useFilterContext();
  const { token } = useAuthSession();
  return useMutation({
    mutationFn: ({
      isSuccess,
      logId,
      day,
    }: {
      isSuccess: boolean;
      logId: string;
      day: number;
    }) => toggleSuccess(isSuccess, logId, day, token),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["logs", filters.year, filters.month],
      });
    },
    onError: (e) => {
      showNotification({
        type: "error",
        title: "Could not update your progress.",
        description: "Please try again.",
      });
    },
  });
}
