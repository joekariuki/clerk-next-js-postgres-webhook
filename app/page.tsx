import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Home</h1>
      <UserButton />
    </div>
  );
}
