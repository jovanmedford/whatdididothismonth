import { useQuery } from "@tanstack/react-query";
import { AuthSession, fetchAuthSession } from "aws-amplify/auth";

export const useAuthSession = () => {
  const {
    data: session,
    status: sessionStatus,
    error: sessionError,
  } = useQuery<AuthSession>({
    queryKey: ["session"],
    queryFn: async () => await fetchAuthSession(),
  });

  return { session, sessionStatus, sessionError, token: session?.tokens?.idToken?.toString() };
};