import { useQuery } from "@tanstack/react-query";
import { fetchUserAttributes } from "aws-amplify/auth";

export default function AppHeader() {
  let { data, status } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserAttributes,
  });

  if (status == "error") {
    return "...Error";
  }

  if (status == "pending") {
    return <div className="w-full h-16"></div>
  }

  return (
    <header className="px-2 md:px-10 pt-8">
      <div className="flex justify-between">
        <span>What Did I Do This Month</span>
        <div>
          <span>Hey {data?.given_name}</span>
        </div>
      </div>

      <p className="text-center mt-2">Calendar</p>
    </header>
  );
}
