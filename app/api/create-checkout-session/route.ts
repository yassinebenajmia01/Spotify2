// pages/api/create-checkout-session.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/libs/stripe"; 
import { getURL } from "@/libs/helper";
import { createOrRetrieveACustomer } from "@/libs/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { price, priceId, quantity = 1, metadata = {} } = body;

    // Safely extract priceId
    if (!priceId) {
      if (price && typeof price === "object" && price.id) {
        priceId = price.id;
      } else {
        return new NextResponse("Price ID is required", { status: 400 });
      }
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return new NextResponse("Not logged in", { status: 401 });

    const customer = await createOrRetrieveACustomer({ uuid: user.id, email: user.email || '' });

    if (!customer) {
      return new NextResponse("Failed to create or retrieve customer", { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      customer, // string
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity }],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: { metadata },
      success_url: `${getURL()}/account?success=true`,
      cancel_url: `${getURL()}/account?canceled=true`,

    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        message: error.message || "Unknown error",
        stack: error.stack || null,
      },
      { status: 500 }
    );
  }
}
