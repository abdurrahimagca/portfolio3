"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "./ui/navigation-menu";
import { BookIcon, HomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { Button } from "./ui/button";

const NavComponent = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <NavigationMenu className="w-[calc(6*var(--sq-1))] ">
      <NavigationMenuList className="flex flex-row justify-between w-full gap-sq-1-2 border-b border-accent mb-sq-1 pb-sq-1-2">
        <NavigationMenuItem>
          <Link href="/" className="flex items-center gap-sq-1-4">
            <HomeIcon className="w-4 h-4" />
            {t("home")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" className="flex items-center gap-sq-1-4">
            <BookIcon className="w-4 h-4" />
            {t("blog")}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="flex flex-row items-center gap-sq-1-8">
            <Button
              onClick={() => switchLocale("en")}
              className="text-sm hover:underline"
              variant="outline"
            >
              EN
            </Button>
            <span className="text-sm">|</span>
            <Button
              onClick={() => switchLocale("tr")}
              className="text-sm hover:underline"
              variant="outline"
            >
              TR
            </Button>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { NavComponent };
