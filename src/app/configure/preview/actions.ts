"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

/**
 * createCheckoutSession creates a checkout session for an order.
 * It first fetches the configuration by configId, then ensures a valid
 * user record is present (via upsert). It either finds an existing order
 * or creates a new one, and finally creates a Stripe checkout session.
 *
 * @param {object} params - Contains the configuration id.
 * @param {string} params.configId - The unique identifier of the configuration.
 */
export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  // 1. Get the configuration from the database using configId.
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });
  if (!configuration) {
    throw new Error("No such configuration found");
  }

  // 2. Retrieve the current user from the session.
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error("You need to be logged in");
  }

  // 3. Ensure that the user exists in our database.
  //    If the user does not already exist, create a new record.
  //    This step prevents foreign key constraint errors when using user.id.
  const dbUser = await db.user.upsert({
    where: { id: user.id },
    update: {}, // No updates if the user is already present.
    create: {
      id: user.id,
      // Provide any required fields such as email. Adjust as needed.
      email: user.email || "",
    },
  });

  // 4. Calculate price based on the configuration options.
  const { finish, material } = configuration;
  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  // 5. Check if an order already exists for this user and configuration.
  let order: Order | undefined = undefined;
  const existingOrder = await db.order.findFirst({
    where: {
      userId: dbUser.id, // Use the ensured dbUser id.
      configurationId: configuration.id,
    },
  });

  console.log("User ID:", dbUser.id, "Configuration ID:", configuration.id);

  // Use the existing order if found; otherwise, create a new order.
  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: dbUser.id, // Use the ensured dbUser id.
        configurationId: configuration.id,
      },
    });
  }

  // 6. Create a Stripe Product to represent this custom case.
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  // 7. Create a Stripe Checkout Session, defining success and cancel URLs.
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      userId: dbUser.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
