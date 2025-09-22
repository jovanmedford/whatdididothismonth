"use client";
import Link from "next/link";
import Logo from "./_components/logo/logo";
import { useEffect, useState } from "react";
import { fetchAuthSession, AuthSession } from "aws-amplify/auth";

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
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    async function getSession() {
      try {
        const newSession = await fetchAuthSession();
        setSession(newSession);
        setStatus("success");
      } catch (e) {
        setStatus("error");
      }
    }

    getSession();
  }, []);


  return (
    <header className="flex justify-between items-center py-8 max-w-xxl w-11/12 md:w-10/12 mx-auto">
      <Logo />
      {status != "pending" ? (
        Boolean(session?.credentials) ? (
          <CalendarLink />
        ) : (
          <LoginSignupLinks />
        )
      ) : null}
    </header>
  );
}
