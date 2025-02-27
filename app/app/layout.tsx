"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getCurrentUser } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showNotification } from "../_components/toast/toast";

Amplify.configure(outputs);

const queryClient = new QueryClient();

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success">("pending");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          throw Error("Please log in to use the app.");
        }

        setStatus("success");
      } catch (e) {
        showNotification({
          type: "error",
          title: "An error occured",
          description: e.message,
        });
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  if (status == "pending") {
    return "...loading";
  }

  return <>{children}</>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
