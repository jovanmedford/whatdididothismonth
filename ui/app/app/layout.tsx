"use client";

import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { showNotification } from "../_components/toast/toast";
import { useQuery } from "@tanstack/react-query";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {status, error} = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  })

  if (status == "error") {
    router.push("/")
    showNotification({
      type: "error",
      title: "An error occured",
      description: error.message,
    });
  }

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
      <SessionProvider>{children}</SessionProvider>
  );
}
