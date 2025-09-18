"use client";
import Link from "next/link";
import { useAuthSession } from "./_hooks/use-auth-session";

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
  const { token, sessionStatus } = useAuthSession();

  return (
    <header className="flex justify-between px-4 py-8">
      <p>What Did I Do This Month?</p>
      {sessionStatus != "pending" ? (
        token ? (
          <CalendarLink />
        ) : (
          <LoginSignupLinks />
        )
      ) : null}
    </header>
  );
}
