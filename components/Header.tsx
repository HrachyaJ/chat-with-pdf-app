"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FilePlus2, Menu, X, Sparkles } from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 shadow-md border-b border-purple-100/50 backdrop-blur-sm">
      {/* Main Header */}
      <div className="flex justify-between items-center p-4 md:p-5">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chat to PDF
            </span>
          </div>
        </Link>

        <SignedIn>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              asChild
              variant="ghost"
              className="hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-medium"
            >
              <Link href="/dashboard/upgrade">Pricing</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-medium"
            >
              <Link href="/dashboard/documents">My Documents</Link>
            </Button>

            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Link
                href="/dashboard/upload"
                className="flex items-center gap-2"
              >
                <FilePlus2 className="h-4 w-4" />
                Upload PDF
              </Link>
            </Button>

            <UpgradeButton />

            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 ring-2 ring-purple-200 hover:ring-purple-300 transition-all duration-200",
                  },
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Quick Upload Button - Always visible on mobile */}
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 shadow-lg"
            >
              <Link href="/dashboard/upload">
                <FilePlus2 className="h-4 w-4" />
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-purple-50 text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </SignedIn>
      </div>

      {/* Mobile Menu Dropdown */}
      <SignedIn>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100 bg-gradient-to-b from-white to-purple-50/50 px-4 py-4 space-y-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-purple-100 text-gray-700 hover:text-purple-700 font-medium"
              size="sm"
            >
              <Link
                href="/dashboard/documents"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Documents
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-purple-100 text-gray-700 hover:text-purple-700 font-medium"
              size="sm"
            >
              <Link
                href="/dashboard/upgrade"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </Button>

            <div className="flex items-center justify-between pt-3 border-t border-purple-100">
              <div className="flex-1">
                <UpgradeButton />
              </div>
              <div className="ml-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-purple-200",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}

export default Header;
