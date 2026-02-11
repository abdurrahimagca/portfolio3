"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      remove: (widgetId: string) => void;
    };
    Cal?: ((...args: unknown[]) => void) & {
      ns?: Record<string, (...args: unknown[]) => void>;
    };
  }
}

interface TurnstileMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function TurnstileMeetingDialog({
  open,
  onOpenChange,
}: TurnstileMeetingDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "verified" | "error"
  >("loading");

  useEffect(() => {
    if (!open) {
      // Clean up widget when dialog closes
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
      setStatus("loading");
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 10 seconds max

    const poll = setInterval(() => {
      attempts++;

      if (attempts > maxAttempts) {
        clearInterval(poll);
        setStatus("error");
        return;
      }

      // Need: turnstile API ready + container in DOM + not already rendered
      if (
        !window.turnstile ||
        typeof window.turnstile.render !== "function" ||
        !containerRef.current ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      clearInterval(poll);
      setStatus("ready");

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: () => {
            setStatus("verified");
            setTimeout(() => {
              onOpenChange(false);
              window.Cal?.ns?.["client-meeting"]?.("openModal", {
                calLink: "agcaabdurrahim/client-meeting",
                config: { layout: "month_view" },
              });
            }, 600);
          },
          "error-callback": () => {
            setStatus("error");
          },
          "expired-callback": () => {
            setStatus("error");
          },
        });
      } catch {
        setStatus("error");
      }
    }, 200);

    return () => {
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quick verification</AlertDialogTitle>
          <AlertDialogDescription>
            Please complete the verification below to book a meeting.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center py-4 min-h-[80px]">
          {status === "verified" ? (
            <p className="text-sm text-green-500">
              Verified — opening calendar...
            </p>
          ) : status === "error" ? (
            <p className="text-sm text-destructive">
              Verification failed. Please close and try again.
            </p>
          ) : (
            <div ref={containerRef} />
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
