
import prismadb from "@/lib/prismadb";
import { SignUp } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";


export default async function Page() {
  

  const clerkUser = await currentUser();
  const clerkUserId = clerkUser?.id;


  const user =  await prismadb.user.findFirst({
    where: {
        clerkId: clerkUserId
    }
  });

  if (!user) {
    return null;
  }
    
  
  return <SignUp fallbackRedirectUrl={`/dashboard/${user.id}`} signInFallbackRedirectUrl="/sign-in" />;


}
