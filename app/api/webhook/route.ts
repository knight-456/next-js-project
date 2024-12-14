import { headers } from "next/headers";
import { NextResponse } from "next/server";

import Stripe from "stripe";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = Stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return NextResponse.json({ message: "Webhook Error: Missing metadata" }, { status: 400 })
        }

        await db.purchase.create({
            data: {
                courseId,
                userId
            }
        })
    } else {
        return NextResponse.json({ message: `Webhook Error: Unhandled event type ${event.type}` }, { status: 200 })
    }

    return NextResponse.json({ data: null }, {status: 200})
}
