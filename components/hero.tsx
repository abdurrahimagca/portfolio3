"use client";

import { H1, H2, Lead } from "./text";
import { Button } from "./ui/button";
import {
  DownloadIcon,
  GithubIcon,
  Linkedin,
  MailIcon,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link as NextLink } from "@/i18n/routing";
const HeroComponent = () => {
  const t = useTranslations("hero");

  return (
    <div className="w-full flex flex-col items-center justify-center p-sq-1 bg-secondary/10">
      <H1>{t("name")}</H1>
      <Lead>{t("tagline")}</Lead>
      <div className="w-full flex justify-center gap-sq-1-2 mt-sq-1-2 flex-col">
        <div className="gap-sq-1-2 w-full justify-center mx-auto">
          <div className="flex flex-row gap-sq-1-2  w-full justify-center mx-auto">
            <NextLink href="https://github.com/abdurrahimagca" target="_blank">
              <Button size="lg" variant="secondary">
                <GithubIcon className="w-4 h-4" />
                {t("github")}
              </Button>
            </NextLink>
            <NextLink
              href="https://linkedin.com/in/agcaabdurrahim"
              target="_blank"
            >
              <Button size="lg" variant="secondary">
                <Linkedin className="w-4 h-4" />
                {t("linkedin")}
              </Button>
            </NextLink>
            <NextLink href="mailto:agcaabdurrahim@outlook.com">
              <Button size="lg" variant="secondary">
                <MailIcon className="w-4 h-4" />
                {t("email")}
              </Button>
            </NextLink>
            <NextLink
              href="https://su.abdurrahimagca.website/cv"
              target="_blank"
            >
              <Button size="lg" variant="secondary">
                <DownloadIcon className="w-4 h-4" />
                {t("downloadCv")}
              </Button>
            </NextLink>
          </div>
        </div>
        <Lead className="secondary-foreground text-center">{t("or")}</Lead>
        <Button
          size="lg"
          className="p-sq-1-2 w-full"
          data-cal-link="agcaabdurrahim/client-meeting"
          data-cal-namespace="client-meeting"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
        >
          <Plus className="w-4 h-4" />
         <span className="text-lg">{t("setMeeting")}</span>
        </Button>
      </div>
    </div>
  );
};

export { HeroComponent };
