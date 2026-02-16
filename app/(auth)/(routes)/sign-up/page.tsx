import React from "react";
import RegistrationForm from "./_components/register-form";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
      </div>
      <div className="w-[96%] md:max-w-5xl mx-auto px-6 py-20">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default page;
