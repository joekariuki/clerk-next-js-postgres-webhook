"use client";

import prismadb from "@/lib/prismadb";
import { UserButton, useAuth } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server";
import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const DashboardPage = ({ params }: { params: { dashboardId: string }}) => {
    const router = useRouter();

  const { isSignedIn, userId, isLoaded } = useAuth();

    useEffect(() => {
        if (isSignedIn && userId) {
          // Redirect to the user's dashboard with their account ID
          router.push(`/dashboard/${userId}`);
        }
      }, [userId]);
    
      if (!isLoaded) {
        return <div>Loading...</div>
      }
      

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Dashboard Page</h1>
      <p>User Clerk Account Id: {params.dashboardId}</p>
      <UserButton />
      
    </div>
  )
}

export default DashboardPage;