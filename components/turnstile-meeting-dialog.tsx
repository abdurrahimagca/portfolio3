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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cal?: any;
  }
}

interface TurnstileMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Module-level flag to prevent double-loading the script
let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadTurnstileScript(): Promise<void> {
  return new Promise(resolve => {
    if (
      scriptLoaded &&
      window.turnstile &&
      typeof window.turnstile.render === "function"
    ) {
      resolve();
      return;
    }

    if (scriptLoading) {
      loadCallbacks.push(resolve);
      return;
    }

    const existing = document.querySelector(
      `script[src^="https://challenges.cloudflare.com/turnstile"]`
    );
    if (existing) {
      scriptLoading = true;
      const poll = setInterval(() => {
        if (window.turnstile && typeof window.turnstile.render === "function") {
          clearInterval(poll);
          scriptLoaded = true;
          scriptLoading = false;
          resolve();
          loadCallbacks.forEach(cb => cb());
          loadCallbacks.length = 0;
        }
      }, 100);
      return;
    }

    scriptLoading = true;
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => {
      const poll = setInterval(() => {
        if (window.turnstile && typeof window.turnstile.render === "function") {
          clearInterval(poll);
          scriptLoaded = true;
          scriptLoading = false;
          resolve();
          loadCallbacks.forEach(cb => cb());
          loadCallbacks.length = 0;
        }
      }, 50);
    };
    script.onerror = () => {
      scriptLoading = false;
      resolve();
    };
    document.head.appendChild(script);
  });
}

export function TurnstileMeetingDialog({
  open,
  onOpenChange,
}: TurnstileMeetingDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "verified" | "error"
  >("loading");
  const [errorDetail, setErrorDetail] = useState<string>("");

  function openCalModal() {
    const cal = window.Cal;
    if (cal && cal.ns && typeof cal.ns["client-meeting"] === "function") {
      cal.ns["client-meeting"]("modal", {
        calLink: "agcaabdurrahim/client-meeting",
        config: { layout: "month_view" },
      });
    } else if (cal && typeof cal === "function") {
      cal("init", "client-meeting", {
        origin: "https://cal.abdurrahimagca.website",
      });
      cal.ns["client-meeting"]("modal", {
        calLink: "agcaabdurrahim/client-meeting",
        config: { layout: "month_view" },
      });
    }
  }

  useEffect(() => {
    if (!open) {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
      setStatus("loading");
      setErrorDetail("");
      return;
    }

    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled) return;

      if (!window.turnstile || typeof window.turnstile.render !== "function") {
        setErrorDetail("Turnstile script failed to initialize.");
        setStatus("error");
        return;
      }

      requestAnimationFrame(() => {
        if (cancelled || !containerRef.current) return;

        setStatus("ready");

        try {
          widgetIdRef.current = window.turnstile!.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme: "dark",
            callback: () => {
              setStatus("verified");
              const calOpener = openCalModal;
              setTimeout(() => {
                onOpenChange(false);
                setTimeout(() => {
                  calOpener();
                }, 400);
              }, 500);
            },
            "error-callback": (errorCode: string) => {
              setErrorDetail(`Turnstile error: ${errorCode}`);
              setStatus("error");
            },
            "expired-callback": () => {
              setErrorDetail("Verification expired. Please try again.");
              setStatus("error");
            },
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setErrorDetail(`Render error: ${msg}`);
          setStatus("error");
        }
      });
    });

    return () => {
      cancelled = true;
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
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-destructive">
                Verification failed. Please close and try again.
              </p>
              {errorDetail && (
                <p className="text-xs text-muted-foreground font-mono break-all max-w-full">
                  {errorDetail}
                </p>
              )}
            </div>
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
