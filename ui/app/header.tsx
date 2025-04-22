"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import Link from "next/link";

const LoginSignupLinks = () => {
  return (
    <div className="flex gap-1">
      <Link href="/login">Log in</Link> / <Link href="/sign-up">Sign up</Link>
    </div>
  );
};

const CalendarLink = () => {
  return <Link href="/app/calendar">View Calendar</Link>;
};

export default function Header() {
  const { status, data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <header className="flex justify-between px-4 py-8">
      <p>What Did I Do This Month?</p>
      {status != "pending" ? (
        data ? (
          <CalendarLink />
        ) : (
          <LoginSignupLinks />
        )
      ) : null}
    </header>
  );
}
