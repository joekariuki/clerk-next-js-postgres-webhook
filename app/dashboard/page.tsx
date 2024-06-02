import { UserButton } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Dashboard Page</h1>
      <UserButton />
    </div>
  );
};

export default Dashboard;
