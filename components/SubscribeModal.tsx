"use client";

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helper";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const { user, isLoading, subscription, reloadSubscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const subscribeModal = useSubscribeModal();

  // Auto-close after subscription
  useEffect(() => {
    if (subscription && subscribeModal.isOpen) {
      const t = setTimeout(() => subscribeModal.onClose(), 250);
      return () => clearTimeout(t);
    }
  }, [subscription, subscribeModal.isOpen, subscribeModal]);

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already Subscribed");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });

      // After returning from Stripe, reload subscription
      await reloadSubscription();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!subscribeModal.isOpen) return null;

  let content = <div className="text-center">No product available.</div>;

  if (subscription) {
    content = <div className="text-center">Already Subscribed 🎉</div>;
  } else if (products.length) {
    content = (
      <div>
        {products.flatMap((product) => {
          if (!product.prices?.length) return <div key={product.id}>No Prices Available</div>;
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className="mb-4"
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={(open) => !open && subscribeModal.onClose()}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
