import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import "../globals.css";
import { NavComponent } from "@/components/nav";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abdurrahim Agca - Portfolio",
  description: "Personal portfolio of Abdurrahim Agca - Full stack developer",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }];
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${notoSans.variable} ${playfairDisplay.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="content-lines w-full max-w-[calc(20*var(--sq-1))] mx-auto px-sq-1 py-sq-1">
            <div className="flex flex-row w-full justify-end">
              <NavComponent />
            </div>
            {children}
          </div>
        </NextIntlClientProvider>
        <Script
          id="turnstile"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad"
          strategy="afterInteractive"
        />
        <Script
          id="cal-embed"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function (C, A, L) {
                let p = function (a, ar) { a.q.push(ar); };
                let d = C.document;
                C.Cal = C.Cal || function () {
                  let cal = C.Cal;
                  let ar = arguments;
                  if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    d.head.appendChild(d.createElement("script")).src = A;
                    cal.loaded = true;
                  }
                  if (ar[0] === L) {
                    const api = function () { p(api, arguments); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    if (typeof namespace === "string") {
                      cal.ns[namespace] = cal.ns[namespace] || api;
                      p(cal.ns[namespace], ar);
                      p(cal, ["initNamespace", namespace]);
                    } else p(cal, ar);
                    return;
                  }
                  p(cal, ar);
                };
              })(window, "https://cal.abdurrahimagca.website/embed/embed.js", "init");
              Cal("init", "client-meeting", { origin: "https://cal.abdurrahimagca.website" });
              Cal.ns["client-meeting"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
            `,
          }}
        />
      </body>
    </html>
  );
}
