import {
  Card, // A styled box for grouping related info
  CardContent, // The main section of the Card
  CardDescription, // A smaller descriptive text for the Card
  CardFooter, // The bottom area of the Card
  CardHeader, // The top area of the Card
  CardTitle, // A bigger title in the Card
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress"; // Shows a progress bar with a certain value
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Components to build a styled table

import { db } from "@/db"; // Database connection
import { formatPrice } from "@/lib/utils"; // Helper function to display numbers as money
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Gets user session
import { notFound } from "next/navigation"; // Shows a "not found" page if needed
import StatusDropdown from "./StatusDropdown"; // A small component to pick order status

const Page = async () => {
  // This gets information about who is logged in
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // This sets the special admin email from environment variables
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // If there is no user or user is not admin, show "not found"
  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  // Fetches paid orders from the past 7 days; sorts them by newest first
  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true, // Include user details
      shippingAddress: true, // Include shipping details
    },
  });

  // Calculates sum of all paid orders over the last 7 days
  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Calculates sum of all paid orders over the last 30 days
  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Example goals we want to reach
  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    // A wrapper that takes the whole width and height, and sets a background color
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Centers main content and adds spacing */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          {/* A grid with 2 columns (on bigger screens) holding 2 cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                {/* Small description text above the title */}
                <CardDescription>Last Week</CardDescription>
                {/* Large text showing the total money made */}
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {/* Tells user how close they are to the weekly goal */}
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                {/* Progress bar showing our progress toward WEEKLY_GOAL */}
                <Progress
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                {/* Description for monthly totals */}
                <CardDescription>Last Month</CardDescription>
                {/* Shows big text with total monthly earnings */}
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {/* Tells user how close they are to the monthly goal */}
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                {/* Progress bar representing our monthly progress */}
                <Progress
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          {/* A title for the table that lists recent orders */}
          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

          <Table>
            <TableHeader>
              <TableRow>
                {/* Headings for each column in the orders table */}
                <TableHead>Customer</TableHead>
                {/* This column is hidden on tiny screens */}
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchase date
                </TableHead>
                {/* Right-aligned heading for amount */}
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                // Each row in the table
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    {/* Customer's name */}
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    {/* Customer's email, hidden if screen is small */}
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user.email}
                    </div>
                  </TableCell>
                  {/* Order status dropdown, hidden on small screens */}
                  <TableCell className="hidden sm:table-cell">
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>
                  {/* Order date, hidden on small screens */}
                  <TableCell className="hidden md:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  {/* The amount paid, aligned to the right */}
                  <TableCell className="text-right">
                    {formatPrice(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
