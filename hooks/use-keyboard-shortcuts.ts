"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const params = useParams();
  const { organizationId, userId } = params as { organizationId: string; userId: string };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Navigation shortcuts (G + key)
      if (e.key.toLowerCase() === "g" && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (event: KeyboardEvent) => {
            resolve(event.key.toLowerCase());
            window.removeEventListener("keydown", handler);
          };
          window.addEventListener("keydown", handler);
          setTimeout(() => {
            window.removeEventListener("keydown", handler);
            resolve("");
          }, 1000);
        });

        nextKey.then((key) => {
          if (!organizationId || !userId) return;
          switch (key) {
            case "d":
              router.push(`/${organizationId}/dashboard/${userId}`);
              break;
      // G + I - Go to Invoices
            case "i":
              router.push(`/${organizationId}/dashboard/${userId}/sales/invoices`);
              break;
            // G + E - Go to Expenses
            case "e":
              router.push(`/${organizationId}/dashboard/${userId}/expenses/all`);
              break;
            // G + P - Go to Products
            case "p":
              router.push(`/${organizationId}/dashboard/${userId}/products/all`);
              break;
            case "c":
              router.push(`/${organizationId}/dashboard/${userId}/sales/customers`);
              break;
            case "r":
              router.push(`/${organizationId}/dashboard/${userId}/reports`);
              break;
          }
        });
        return;
      }

      // Ctrl/Cmd + K - Command palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toast.info("Command palette", { description: "Coming soon!" });
        return;
      }

      // Ctrl/Cmd + / - Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]') as HTMLElement;
        sidebarTrigger?.click();
        return;
      }

      // Ctrl/Cmd + B - Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        const themeToggle = document.querySelector('[data-theme-toggle]') as HTMLElement;
        if (themeToggle) {
          themeToggle.click();
        } else {
          const theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", theme);
        }
        return;
      }

      // Ctrl/Cmd + N - Create new invoice
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/sales/invoices/new`);
        }
        return;
      }

      // Ctrl/Cmd + E - Create new expense
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/expenses/all/new`);
        }
        return;
      }

      // Ctrl/Cmd + P - Create new product
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/products/all/new`);
        }
        return;
      }

      // Ctrl/Cmd + S - Save current form
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const saveButton = document.querySelector('button[type="submit"]') as HTMLElement;
        saveButton?.click();
        return;
      }

      // Ctrl/Cmd + Enter - Submit form
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        const submitButton = document.querySelector('button[type="submit"]') as HTMLElement;
        submitButton?.click();
        return;
      }

      // Alt + I - New invoice
      if (e.altKey && e.key.toLowerCase() === "i" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/sales/invoices/new`);
        }
        return;
      }

      // Alt + E - New estimate
      if (e.altKey && e.key.toLowerCase() === "e" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/sales/estimates/new`);
        }
        return;
      }

      // Alt + R - Record payment
      if (e.altKey && e.key.toLowerCase() === "r" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/sales/payments/new`);
        }
        return;
      }

      // Alt + C - New customer
      if (e.altKey && e.key.toLowerCase() === "c" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/sales/customers/new`);
        }
        return;
      }

      // Alt + P - New product
      if (e.altKey && e.key.toLowerCase() === "p" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/products/all/new`);
        }
        return;
      }

      // Alt + A - Stock adjustment
      if (e.altKey && e.key.toLowerCase() === "a" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/products/adjustments`);
        }
        return;
      }

      // Alt + O - Purchase order
      if (e.altKey && e.key.toLowerCase() === "o" && !isInput) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/expenses/purchase-orders/new`);
        }
        return;
      }

      // Ctrl/Cmd + , - Open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/settings/company`);
        }
        return;
      }

      // Ctrl/Cmd + Shift + P - User preferences
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/profile`);
        }
        return;
      }

      // ? - Show keyboard shortcuts
      if (e.key === "?" && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (organizationId && userId) {
          router.push(`/${organizationId}/dashboard/${userId}/settings/shortcuts`);
        }
        return;
      }

      // Esc - Close dialogs/modals
      if (e.key === "Escape") {
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          const closeButton = dialog.querySelector('[aria-label="Close"]') as HTMLElement;
          closeButton?.click();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, organizationId, userId]);
}
