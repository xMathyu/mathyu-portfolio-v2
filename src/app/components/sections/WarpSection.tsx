"use client";

import { useTranslations } from "next-intl";
import { VIDEOS } from "@/app/lib/videos";
import ScrubVideo from "../ui/ScrubVideo";

/** Scroll-scrubbed flight through a light tunnel that leads into the tech stack. */
export default function WarpSection() {
  const t = useTranslations("Warp");
  return (
    <section aria-label={t("l1")}>
      <ScrubVideo
        clip={VIDEOS.warp}
        reveal="portal"
        lines={[t("l1"), t("l2"), t("l3")]}
        caption={t("caption")}
      />
    </section>
  );
}
