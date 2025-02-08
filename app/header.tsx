import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between px-4 py-8">
      <p>What Did I Do This Month?</p>
      <div className="flex gap-1">
        <Link href="#">Log in</Link> / <Link href="#">Sign up</Link>
      </div>
    </header>
  );
}
