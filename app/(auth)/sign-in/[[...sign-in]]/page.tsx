
import prismadb from "@/lib/prismadb";
import { SignIn } from "@clerk/nextjs";
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
    return;
  } 

  
  return <SignIn forceRedirectUrl={`/dashboard/${user.id}`} />;
}
