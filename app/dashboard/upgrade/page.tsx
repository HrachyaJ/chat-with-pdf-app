"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  CheckIcon,
  Sparkles,
  Star,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import getStripe from "@/lib/stripe-js";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";

export type UserDetails = {
  email: string;
  name: string;
};

const Pricing = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    if (!user.primaryEmailAddress || !user.fullName) {
      return;
    }

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress.toString(),
      name: user.fullName,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
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
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Supercharge your Document Companion
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose an affordable plan that's packed with the best features for
            interacting with your PDFs, enhancing productivity, and streamlining
            your workflow
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="group relative">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Free Plan
                </h3>
                <p className="text-gray-600">
                  Perfect for trying out the service
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">3 PDFs per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">50 questions per PDF</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Mobile friendly interface
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="group relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm px-4 py-2 rounded-full shadow-lg">
                Most Popular
              </div>
            </div>

            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 pt-12">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                </div>
                <p className="text-gray-600">For power users who need more</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    $5.99
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-500">Billed monthly</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Store up to 20 PDFs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Up to 100 messages per document
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Full Power AI Chat with Memory Recall
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    24-hour support response time
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 group cursor-pointer"
                disabled={loading || isPending}
                onClick={handleUpgrade}
              >
                {isPending || loading ? (
                  "Loading..."
                ) : hasActiveMembership ? (
                  <span className="flex items-center gap-2">
                    Manage Plan
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Upgrade to Pro
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-600 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-400 rounded-full"></span>
            No commitment
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-400 rounded-full"></span>
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-400 rounded-full"></span>
            Secure payments
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
