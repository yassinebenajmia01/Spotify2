"use client";

import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { postData } from "@/libs/helper";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user, reloadSubscription } = useUser();
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({ url: "/api/create-portal-link" });
      if (error) throw new Error(error as any);
      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
      // 🔑 Refresh subscription in case plan changed in Stripe portal
      await reloadSubscription();
    }
  };

  return (
    <div className="mb-7 px-6">
      {!subscription ? (
        <div className="flex flex-col gap-y-4">
          <p>No Active Plan.</p>
          <Button onClick={subscribeModal.onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.
          </p>
          <Button
            className="w-[300px]"
            disabled={loading || isLoading}
            onClick={redirectToCustomerPortal}
          >
            Open Customer Portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
