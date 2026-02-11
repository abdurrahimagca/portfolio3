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
    onTurnstileLoad?: () => void;
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
  const [verified, setVerified] = useState(false);

  // Render turnstile when the dialog is open
  useEffect(() => {
    if (!open) return;

    // Reset state for fresh dialog open
    setVerified(false);

    const renderWidget = () => {
      if (
        !containerRef.current ||
        widgetIdRef.current !== null ||
        !window.turnstile?.render
      )
        return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: () => {
          setVerified(true);
          setTimeout(() => {
            onOpenChange(false);
            window.Cal?.ns?.["client-meeting"]?.("openModal", {
              calLink: "agcaabdurrahim/client-meeting",
              config: { layout: "month_view" },
            });
          }, 600);
        },
      });
    };

    // If turnstile is already loaded, render immediately
    if (window.turnstile?.render) {
      // Small delay to ensure the AlertDialog portal has mounted the container
      const timer = setTimeout(renderWidget, 100);
      return () => {
        clearTimeout(timer);
        cleanup();
      };
    }

    // Otherwise wait for the onload callback
    const prevOnload = window.onTurnstileLoad;
    window.onTurnstileLoad = () => {
      prevOnload?.();
      renderWidget();
    };

    return () => {
      window.onTurnstileLoad = prevOnload;
      cleanup();
    };

    function cleanup() {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // widget may already be removed
        }
        widgetIdRef.current = null;
      }
    }
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

        <div className="flex justify-center py-4 min-h-[80px]">
          {verified ? (
            <p className="text-sm text-green-500">
              Verified — opening calendar...
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
