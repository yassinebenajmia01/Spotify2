"use client";

import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";

const Account = () => {
  const searchParams = useSearchParams();
  const { reloadSubscription } = useUser();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      reloadSubscription(); // fetch the latest subscription
    }
  }, [searchParams, reloadSubscription]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountContent />
    </div>
  );
};

export default Account;