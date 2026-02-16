"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  redirectTo?: string;
  showMagicLink?: boolean;
}

const formSchema = z.object({
  identifier: z.string().min(2, "Enter a valid username or email."),
  password: z.string().min(5, "Password must be at least 5 characters."),
});

const LoginForm = ({
  onSuccess,
  onError,
  className = "",
  redirectTo,
}: LoginFormProps) => {
  const { login, verifyTwoFactor } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await login({
        email: values.identifier,
        password: values.password,
      });

      if (!result.success) {
        toast.error("Login Failed", {
          description: result.error || "Invalid credentials",
        });
        onError?.(result.error || "Invalid credentials");
        return;
      }

      if (result.requiresMfa) {
        setRequiresMfa(true);
        toast.info("Two-Factor Authentication Required", {
          description: "Please enter your authentication code.",
        });
        return;
      }

      toast.success("Welcome Back!", {
        description: "You are now logged in.",
      });
      onSuccess?.();
      
      // Build redirect URL from user data
      if (result.user?.organizationId && result.user?.id) {
        window.location.href = `/${result.user.organizationId}/dashboard/${result.user.id}`;
      } else {
        window.location.href = redirectTo || "/dashboard";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error("Login Failed", {
        description: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyTwoFactor(mfaCode, undefined, rememberDevice);
      if (result.success) {
        toast.success("Login successful!", {
          description: "Welcome back! Redirecting to your dashboard.",
        });
        onSuccess?.();
        window.location.href = redirectTo || "/dashboard";
      } else {
        toast.error(result.error || "Invalid code", {
          description: "Please check your code and try again.",
        });
      }
    } catch (error) {
      toast.error("Verification failed", {
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (requiresMfa) {
    return (
      <form onSubmit={handleMfaSubmit} className={`space-y-4 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Two-Factor Authentication
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Enter the code from your authenticator app
          </p>
        </div>

        <div>
          <label
            htmlFor="mfaCode"
            className="block text-sm font-medium text-gray-700"
          >
            Authentication Code
          </label>
          <input
            id="mfaCode"
            type="text"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="000000"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            maxLength={6}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="rememberDevice"
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberDevice"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember this device for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    );
  }

  async function handleMagicLink() {
    const email = form.getValues("identifier");
    if (!email || !email.includes("@")) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      // Send magic link email
      // await sendMagicLink(email)

      toast.success("Magic Link Sent!", {
        description: "Check your email for the login link.",
      });
    } catch (error) {
      toast.error("Failed to send magic link", {
        description: "Please try again.",
      });
    }
  }
  // error instanceof Error ? error.message :

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Username or Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter username or email"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <div className="flex items-center">
                <FormLabel className="font-bold" htmlFor="password">
                  Password
                </FormLabel>
                <Link
                  href="/forgot_password"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...field}
                    disabled={isSubmitting}
                    className="pr-10" // space for the eye icon
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-2 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="w-full text-center"
          type="submit"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Signing in..." : "Log In"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Link
          href="/magic-link"
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Login with Magic Link
        </Link>
      </form>
    </Form>
  );
};

export default LoginForm;
