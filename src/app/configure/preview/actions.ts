"use server"; // Marks this file to run on the server (where private data like keys is safe).

// Import base pricing values and extra prices for certain options.
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
// Import the database connection so that we can query our database.
import { db } from "@/db";
// Import Stripe library object to interact with the Stripe payment API.
import { stripe } from "@/lib/stripe";
// Import a helper function to get the current user session.
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// Import the Order type from Prisma (helps TypeScript understand the shape of an Order record).
import { Order } from "@prisma/client";

/**
 * createCheckoutSession creates a Stripe checkout session for a phone case order.
 *
 * What it does (in super simple words):
 * 1. It looks for a configuration (a set of details for a phone case) in the database using a special id.
 * 2. It finds out which user is making the request. If the user is not logged in, it stops.
 * 3. It makes sure the user exists in our database (or adds them if they don't).
 * 4. It calculates the price of the case using the base price and extra costs for chosen options.
 * 5. It checks if an order for this configuration already exists for the user; if not, it creates one.
 * 6. It creates a product in Stripe for this custom case.
 * 7. It creates a Stripe Checkout Session so the user can pay, setting a good URL for when they succeed or cancel.
 *
 * @param {object} params - An object that has our configuration id.
 * @param {string} params.configId - The special id that tells us which phone case configuration to use.
 */
export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  // 1. Get the configuration details from the database using the given id.
  // This configuration contains things like the image URL, chosen finish, material, etc.
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });
  // If there is no configuration with that id, stop and show an error.
  if (!configuration) {
    throw new Error("No such configuration found");
  }

  // 2. Retrieve the current user's info using our session function.
  // This checks if someone is logged in and returns their details.
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  // If there is no user (nobody is logged in), we stop the function and show an error.
  if (!user) {
    throw new Error("You need to be logged in");
  }

  // 3. Make sure the user exists in our database.
  // If the user isn't in our user table, we create a new record for them.
  // This prevents errors later when we try to link an order to a user.
  const dbUser = await db.user.upsert({
    where: { id: user.id }, // Looks for a record with this user id.
    update: {}, // If the user exists, we don't change anything.
    create: {
      id: user.id,
      // Create a new user record with the user's email (or an empty string if no email is provided).
      email: user.email || "",
    },
  });

  // 4. Calculate the final price for the phone case.
  // Start with a simple base price and then add extra charges based on choices.
  const { finish, material } = configuration;
  let price = BASE_PRICE; // This is our starting price.
  // If the finish is "textured", add the extra cost for textured finish.
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  // If the material is "polycarbonate", add that extra cost.
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  // 5. Check if there is already an order for this user and configuration.
  // This prevents creating duplicate orders.
  let order: Order | undefined = undefined;
  const existingOrder = await db.order.findFirst({
    where: {
      userId: dbUser.id, // Make sure it matches the current user's id.
      configurationId: configuration.id, // And the configuration we are using.
    },
  });

  console.log("User ID:", dbUser.id, "Configuration ID:", configuration.id);

  // If there is an existing order, use that order.
  if (existingOrder) {
    order = existingOrder;
  } else {
    // Else, create a new order because one wasn't found.
    // The order is connected to the current user and the chosen configuration.
    order = await db.order.create({
      data: {
        amount: price / 100, // Stripe expects the amount in cents.
        userId: dbUser.id, // Link this order to the user's id in our database.
        configurationId: configuration.id, // Link to the configuration details.
      },
    });
  }

  // 6. Now, create a Stripe Product to represent this custom phone case.
  // A Stripe Product holds details about what is being sold.
  const product = await stripe.products.create({
    name: "Custom iPhone Case", // A friendly name for the product.
    images: [configuration.imageUrl], // Use the image from the configuration.
    default_price_data: {
      currency: "USD", // Set currency to US Dollars.
      unit_amount: price, // The price in cents.
    },
  });

  // 7. Create a Stripe Checkout Session.
  // This session is what gives the user a secure page to enter their payment details.
  // It also includes URLs that tell Stripe where to send the user after payment.
  const stripeSession = await stripe.checkout.sessions.create({
    // When the payment is successful, the user will be sent to this URL.
    // NEXT_PUBLIC_SERVER_URL is defined in our environment variables and forms the base URL.
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    // If the user cancels the payment, they will return here.
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"], // Only allow card payments.
    mode: "payment", // This session is for a one-time payment.
    // Allow shipping addresses but only from specific countries.
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      // Add extra data so we know which user and order this payment is for.
      userId: dbUser.id,
      orderId: order.id,
    },
    // The line_items array lists what the customer is buying.
    // Here we use the product we just created, along with a quantity of 1.
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  // Return the URL from the Stripe session so the client can be redirected to the checkout page.
  return { url: stripeSession.url };
};
