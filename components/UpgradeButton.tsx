"use client";

import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, Crown, Zap } from "lucide-react";
import { createStripePortal } from "@/actions/createStripePortal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  if (!hasActiveMembership && !loading) {
    return (
      <Button
        asChild
        className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
      >
        <Link
          href="/dashboard/upgrade"
          className="flex items-center gap-2 relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Zap className="h-4 w-4" />
          Upgrade
        </Link>
      </Button>
    );
  }

  if (loading) {
    return (
      <Button
        variant="default"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
        disabled
      >
        <Loader2Icon className="animate-spin h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-700/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {isPending ? (
        <div className="flex items-center gap-2 relative z-10">
          <Loader2Icon className="animate-spin h-4 w-4" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 relative z-10">
          <Crown className="h-4 w-4 text-yellow-300" />
          <span className="font-extrabold">PRO</span>
          <span className="font-medium">Account</span>
        </div>
      )}
    </Button>
  );
}

export default UpgradeButton;
