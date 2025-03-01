import { db } from "@/db"; // Connects to our database so we can update/store info.
import { stripe } from "@/lib/stripe"; // Stripe client to handle Stripe events and webhooks.
import { headers } from "next/headers"; // Allows us to read incoming request headers in Next.js.
import { NextResponse } from "next/server"; // Used to craft responses within Next.js routes.
import Stripe from "stripe"; // Types for Stripe objects (like Checkout.Session).
import { Resend } from "resend"; // Resend API for sending emails.
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail"; // A React component to generate a "Thank You" email.

const resend = new Resend(process.env.RESEND_API_KEY);
// Instantiates the Resend client using an API key from our environment variables.

export async function POST(req: Request) {
  // The POST function handles Stripe webhook events. When Stripe sends a request to this route, we process it.

  try {
    /*
      1. Read the body (Raw text) of the request so we can verify it with Stripe.
         We need raw text because Stripe requires a signature match with the exact text.
    */
    const body = await req.text();

    /*
      2. Extract the Stripe signature from the request headers.
         Stripe uses a special header called 'stripe-signature' to ensure the webhook is from them.
    */
    const singnature = (await headers()).get("stripe-signature");

    // 3. If no signature is found, respond with a 400 error.
    if (!singnature) {
      return new Response("Invalid singnature", { status: 400 });
    }

    /*
      4. Construct the event from the raw body, the signature, and our webhook secret.
         This ensures the request is valid and from Stripe.
    */
    const event = stripe.webhooks.constructEvent(
      body,
      singnature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    /*
      5. Check if the event type is "checkout.session.completed" which means someone finished a payment.
    */
    if (event.type === "checkout.session.completed") {
      // 6. Verify that the session includes a customer email; if not, throw an error.
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing email");
      }

      // 7. Extract the session object from the event's data.
      const session = event.data.object as Stripe.Checkout.Session;

      /*
        8. We read metadata from the session, which includes userId and orderId.
           These were set when creating the Stripe session, so we know which user/order to update.
      */
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      // 9. If userId or orderId is missing, throw an error because we can't update the correct order.
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      /*
        10. Extract the user's billing and shipping addresses from the session's details.
            Stripe collects these if shippingAddressCollection is enabled or if set manually in the session.
      */
      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      /*
        11. Update that specific order in our database:
          - Mark it as paid (isPaid: true).
          - Attach the shipping address and billing address that the user entered.
        The "create" syntax is a Prisma feature to insert related records.
      */
      const updatedOrder = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            },
          },
        },
      });

      /*
        12. After updating the order, send a "Thank You" email to the customer.
            We call Resend's .emails.send() method:
              • "from": our email address and the name "caseEvo" that shows up as the sender.
              • "to": the customer's email from the Stripe checkout session.
              • "subject": The subject line of the email.
              • "react": We pass in a React component (OrderReceivedEmail) that returns the email content.
      */
      await resend.emails.send({
        from: "caseEvo <utkarshkhajuria7@gmail.com>",
        to: event.data.object.customer_details.email,
        subject: "Thanks for your order",
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          // We use the shipping address details from the session for personalizing the email.
          //@ts-ignore
          shippingAddress: {
            name: session.customer_details!.name!,
            city: shippingAddress!.city!,
            country: shippingAddress!.country!,
            postalCode: shippingAddress!.postal_code!,
            street: shippingAddress!.line1!,
            state: shippingAddress!.state,
          },
        }),
      });
    }

    /*
      13. If everything went well, return a JSON response saying all is OK,
          along with the event data for reference.
    */
    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    // If anything breaks in the try block, we catch it here and log the error.
    console.error(err);

    /*
      Finally, we respond with a 500 status (server error) and a small JSON message
      indicating something went wrong, so integrators understand the error.
    */
    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
