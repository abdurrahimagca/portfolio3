"use client";

import { useState } from "react";
import { H1, Lead } from "./text";
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
import { TurnstileMeetingDialog } from "./turnstile-meeting-dialog";

const HeroComponent = () => {
  const t = useTranslations("hero");
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center p-sq-1 bg-secondary/10 overflow-x-hidden min-w-0">
      <H1>{t("name")}</H1>
      <Lead>{t("tagline")}</Lead>
      <div className="w-full flex justify-center gap-sq-1-2 mt-sq-1-2 flex-col">
        <div className="gap-sq-1-2 w-full justify-center mx-auto min-w-0">
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-sq-1-2 w-full justify-center mx-auto max-w-full min-w-0 place-items-stretch">
            <NextLink href="https://github.com/abdurrahimagca" target="_blank" className="flex">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <GithubIcon className="w-4 h-4" />
                {t("github")}
              </Button>
            </NextLink>
            <NextLink
              href="https://linkedin.com/in/agcaabdurrahim"
              target="_blank"
              className="flex"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Linkedin className="w-4 h-4" />
                {t("linkedin")}
              </Button>
            </NextLink>
            <NextLink href="mailto:agcaabdurrahim@outlook.com" className="flex">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <MailIcon className="w-4 h-4" />
                {t("email")}
              </Button>
            </NextLink>
            <NextLink
              href="https://su.abdurrahimagca.website/cv"
              target="_blank"
              className="flex"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
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
          onClick={() => setMeetingDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="text-lg">{t("setMeeting")}</span>
        </Button>
      </div>

      <TurnstileMeetingDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
      />
    </div>
  );
};

export { HeroComponent };
