"use server";
// "use server" tells Next.js that this file should only run on the server side,
// not in the user's browser. This offers better security for sensitive data.

/*
  IMPORTS:
  - db: Our database connection for performing queries on the "order" table.
  - OrderStatus: An enum from our Prisma schema containing possible order statuses.
*/
import { db } from "@/db";
import { OrderStatus } from "@prisma/client";

/**
 * changeOrderStatus
 * ---------------------------
 * This function changes the status of an existing order in the database.
 *
 * Step by step:
 * 1. We receive an object containing the order id and the new status.
 * 2. We run a Prisma "update" command on the "order" table, targeting a record that has the matching id.
 * 3. We set the "status" field to the new status we were provided.
 *
 * Even a 5-year-old description:
 * "We have an order and we want to say if it's 'Sent', 'Canceled', or anything else.
 *  So we open our big box (the database) with all the 'orders,' find the one that matches the special id,
 *  and then change its 'status' label to the new one."
 *
 * Note: This file has no CSS or class names, so there are no style references here.
 */
export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) => {
  // Access our database and update the record in the 'order' table that matches the 'id'.
  await db.order.update({
    // 'where' identifies which record to update by matching the 'id' field.
    where: { id },
    // 'data' contains the fields to modify—in this case, 'status'.
    data: { status: newStatus },
  });
};
