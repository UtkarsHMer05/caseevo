"use server";
/*
  "use server" tells Next.js that this code runs on the server side, 
  not on the client (browser). We use this for data fetching or secure operations.
*/

import { db } from "@/db";
/*
  'db' is our database connection object. We use this to create, read, 
  update, or delete records in the database.
*/

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
/*
  'getKindeServerSession' helps us figure out which user is 
  currently logged in, so we can secure data and pages.
*/

/*
  getPaymentStatus is a function that checks if a given order has been paid. 
  It does the following:
   1. Checks the logged-in user's information.
   2. Looks up the order in the database using the orderId and user ID.
   3. If the order is found and is paid, returns all the order data.
   4. If the order is not paid, returns false.
*/
export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  // Get the function to retrieve user details from the session
  const { getUser } = getKindeServerSession();
  // Actually fetch the user's details
  const user = await getUser();

  // If there's no user info, stop and complain
  if (!user?.id || !user.email) {
    throw new Error("You need to be logged in to view this page.");
  }

  // Find an order in the database that matches the given ID and the user's ID
  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id }, // Must match our user's order
    include: {
      billingAddress: true, // Also return the billing address
      configuration: true, // ...plus any config details
      shippingAddress: true, // ...plus shipping info
      user: true, // ...plus user info
    },
  });

  // If no matching order is found, throw an error
  if (!order) throw new Error("This order does not exist.");

  // Check if the order is paid. If yes, return the order. Otherwise, return false
  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};
