import Stripe from "stripe";

export const stripe= new Stripe(
    process.env.STRIPE_SECRET_KEY ?? '',
    {
        apiVersion:'2022-11-15' as any,
        appInfo:{
        name:'Spotify 2 Video',
        version:'0.1.0'
        }
    }
);