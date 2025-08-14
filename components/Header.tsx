"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { FilePlus2, Menu, X } from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-sm border-b">
      {/* Main Header */}
      <div className="flex justify-between items-center p-4 md:p-5">
        <Link href="/dashboard" className="text-xl md:text-2xl font-semibold">
          Chat to <span className="text-indigo-600">PDF</span>
        </Link>

        <SignedIn>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="link">
              <Link href="/dashboard/upgrade">Pricing</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard/documents">My Documents</Link>
            </Button>

            <Button asChild variant="outline" className="border-indigo-600">
              <Link href="/dashboard/upload">
                <FilePlus2 className="text-indigo-600" />
              </Link>
            </Button>

            <UpgradeButton />
            <UserButton />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Quick Upload Button - Always visible on mobile */}
            <Button asChild variant="outline" size="sm" className="border-indigo-600 p-2">
              <Link href="/dashboard/upload">
                <FilePlus2 className="text-indigo-600 h-4 w-4" />
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SignedIn>
      </div>

      {/* Mobile Menu Dropdown */}
      <SignedIn>
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-gray-50 px-4 py-3 space-y-2">
            <Button asChild variant="ghost" className="w-full justify-start" size="sm">
              <Link href="/dashboard/documents" onClick={() => setMobileMenuOpen(false)}>
                My Documents
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="w-full justify-start" size="sm">
              <Link href="/dashboard/upgrade" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
            </Button>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex-1">
                <UpgradeButton />
              </div>
              <UserButton />
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}

export default Header;