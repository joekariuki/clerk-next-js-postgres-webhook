import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1>Home</h1>
      <Link href={`/sign-in`}>Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
