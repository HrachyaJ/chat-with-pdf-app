'use client'

import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import getStripe from "@/lib/stripe-js";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";

export type UserDetails = {
  email: string;
  name: string;
}

const Pricing = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

  if (!user.primaryEmailAddress || !user.fullName) {
  // Optionally show a toast or error message here
  return;
  }

  const userDetails: UserDetails = {
    email: user.primaryEmailAddress.toString(),
    name: user.fullName,
  };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        // create stripe portal
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-6xl mx-auto mt-4">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your Document Companion
          </h2>
          <p className="mx-auto mt-6 max-w-3xl px-10 text-center text-lg leading-8 text-gray-600">
            Choose an affordable plan thats packed with the best features for interacting with your PDFs, enhancing productivity, and streamlining your workflow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Free Plan */}
        <div className="rounded-[20px] border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Free Plan</h3>
          <p className="text-gray-500 mb-6">Perfect for trying out the service</p>
          <div className="mt-8">
            <p className="text-4xl font-bold mb-6">Free</p>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>3 PDFs per month</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>50 questions per PDF</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Mobile friendly interface</span>
            </div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="rounded-[20px] border border-indigo-600 p-8 shadow-sm hover:shadow-md transition-shadow bg-gray-50">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Pro Plan</h3>
          <p className="text-gray-500">For power users who need more</p>
          <div className="mt-8">
            <p className="text-4xl font-bold mb-4">$5.99<span className="text-sm font-semibold leading-6 text-gray-600">/month</span></p>
            <Button
              className="bg-indigo-600 w-full mb-6 text-white shadow-sm hover:bg-indigo-500 mt-6 rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer flex items-center justify-center"
              disabled={loading || isPending}
              onClick={handleUpgrade}
            >
              {isPending || loading ? "Loading..." : hasActiveMembership ? "Manage Plan" : "Upgrade to Pro"}
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Store up to 20 PDFs</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Up to 100 messages per document</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Full Power AI Chat Functionality with Memory Recall</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>24-hour support response time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing