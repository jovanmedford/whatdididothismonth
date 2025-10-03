import { showNotification } from "@/app/_components/toast/toast";
import { deleteLog } from "@/app/_lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilterContext } from "./filter-context";
import { useAuthSession } from "@/app/_hooks/use-auth-session";

export default function useDeleteMutation() {
  const queryClient = useQueryClient();
  const { filters } = useFilterContext();
  const { token } = useAuthSession();
  console.log(filters);
  return useMutation({
    mutationFn: (ids: string) => deleteLog(ids, token),
    onSuccess: () => {
      console.log("FIRING");
      return queryClient.invalidateQueries({
        queryKey: ["logs", filters.year, filters.month],
      });
    },
    onError: (e) => {
      console.log("Error", e);
      showNotification({
        type: "error",
        title: "Could not delete.",
        description: e.message,
      });
    },
  });
}
