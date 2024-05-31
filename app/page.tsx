import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Home</h1>
      <UserButton />
    </div>
  );
}
