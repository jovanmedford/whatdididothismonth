import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import Button from "../_components/button/button";
import { showNotification } from "../_components/toast/toast";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
    onError: () =>
      showNotification({
        title: "Error",
        type: "error",
        description: "Error logging out.",
      }),
  });

  let { data, status } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserAttributes,
  });

  if (status == "error") {
    return "...Error";
  }

  if (status == "pending") {
    return <div className="w-full h-16"></div>;
  }

  const handleLogout = async () => {
    mutation.mutate();
  };

  return (
    <header className="px-2 md:px-10 pt-8">
      <div className="flex justify-between">
        <span>What Did I Do This Month</span>
        <div className="flex flex-col">
          <span>Hey {data?.given_name || "friend"}</span>
          <Button size="small" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <p className="text-center mt-2">Calendar</p>
    </header>
  );
}
