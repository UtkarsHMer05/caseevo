"use server"; // This tells Next.js that the code here will only run on the server.

/*
  IMPORTS:
  - We import 'db' to talk with our database. Think of it as our big toy box where we keep all our user data.
  - We import 'getKindeServerSession' to handle our login session work. This is like asking, "Who is playing with my toys?"
*/
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * getAuthStatus
 * ------------------------------
 * This asynchronous function checks the user's authentication status and makes sure that the user is registered in our database.
 *
 * Step-by-step explanation:
 * 1. We use getKindeServerSession() to get a special helper for our authentication. It gives us a function called getUser.
 * 2. With getUser(), we ask, "Who is the current user?" (It gets the user's information.)
 * 3. We check if the user has an ID and email. If not, we throw an error because these are very important details (like a name tag).
 * 4. We then search our database using db.user.findFirst to see if the user is already there.
 * 5. If the user is not in our database, we add them using db.user.create. This step is like saying, "If you are new, welcome! We are adding you to our friend list."
 * 6. Finally, we return an object with success: true, meaning everything went well.
 *
 * Even a 5-year-old can understand it as:
 * "First, we check who is here. If they are new, we take their picture and name. Then we say 'all done, success!'"
 */
export const getAuthStatus = async () => {
  // Call getKindeServerSession to get our special session object. From it, we get the getUser function.
  const { getUser } = getKindeServerSession();

  // Ask: "Who is the current user?" This returns a user object (or nothing if no one is logged in).
  const user = await getUser();

  // Check if the user object has an id and email.
  // If one of them is missing, we stop and show an error because our game needs both a name (id) and a letter (email).
  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  // Look in our big toy box (the database) to see if this user is already part of our list.
  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  });

  // If the user is not already in the list, we add them.
  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id, // Their unique name tag.
        email: user.email, // Their special letter.
      },
    });
  }

  // Finally, let everyone know that everything went well!
  return { success: true };
};
