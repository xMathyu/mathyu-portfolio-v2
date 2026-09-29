"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { FiCheck, FiPause, FiZap } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, PIN_OK } from "@/app/lib/gsap";
import { VIDEOS } from "@/app/lib/videos";
import SectionHeading from "../ui/SectionHeading";
import ScrubVideo from "../ui/ScrubVideo";
import TechIcon from "../TechIcon";

const STEPS = ["ingest", "transcribe", "understand"] as const;
const LAYERS = ["audio", "transcript", "insights"] as const;
const STACK = ["Python", "FastAPI", "Whisper X", "AWS", "Lambda", "SQS", "OpenAI"];

const BAR_COUNT = 56;
const WAVE_COLORS = ["#0894ff", "#c959dd", "#ff2e54", "#ff9004"];
const waveColor = gsap.utils.interpolate(WAVE_COLORS);
const envelope = (i: number) => 0.3 + 0.7 * Math.sin((Math.PI * i) / (BAR_COUNT - 1));

const SPARK_PATH = "M2 34 L20 28 L36 31 L54 20 L72 23 L90 12 L108 15 L126 4";
const SPARK_LENGTH = 140;

// Mockup layers are stacked in one grid cell only when the section can pin
// (motion allowed and enough height); otherwise every step is listed and the
// mockup shows its final "insights" state.
const stacked = "pin:[grid-area:1/1]";
const hiddenUntilScroll = "pin:invisible pin:opacity-0";

export default function CaseStudySection() {
  const t = useTranslations("CaseStudy");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_OK, () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-cs-step]");
        const layers = gsap.utils.toArray<HTMLElement>("[data-cs-layer]");
        const labels = gsap.utils.toArray<HTMLElement>("[data-cs-label]");
        const bars = gsap.utils.toArray<HTMLElement>("[data-cs-bar]");

        const tl = gsap.timeline({
          defaults: { duration: 0.5, ease: "power2.inOut" },
          scrollTrigger: {
            trigger: "[data-cs-pin]",
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tl.to(bars[0], { scaleX: 1, ease: "none", duration: 1 }, 0);
        for (let i = 1; i < STEPS.length; i++) {
          tl.to(steps[i - 1], { autoAlpha: 0, y: -40 }, i)
            .fromTo(steps[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0 }, i + 0.25)
            .to(layers[i - 1], { autoAlpha: 0, scale: 0.94 }, i)
            .fromTo(layers[i], { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1 }, i + 0.2)
            .to(labels[i - 1], { autoAlpha: 0, yPercent: -100 }, i)
            .fromTo(labels[i], { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0 }, i + 0.2)
            .to(bars[i], { scaleX: 1, ease: "none", duration: 1 }, i);
        }
        tl.from("[data-cs-line]", { autoAlpha: 0, y: 16, stagger: 0.12, duration: 0.3 }, 1.4)
          .from("[data-cs-insight]", { autoAlpha: 0, y: 24, scale: 0.96, stagger: 0.08, duration: 0.3 }, 2.4)
          .from("[data-cs-meter]", { scaleX: 0, stagger: 0.08, duration: 0.4 }, 2.55)
          .fromTo(
            "[data-cs-spark]",
            { strokeDashoffset: SPARK_LENGTH },
            { strokeDashoffset: 0, duration: 0.5, ease: "none" },
            2.6,
          )
          .to({}, { duration: 0.4 });

        // Live waveform — only runs while the section is on screen
        const wave = gsap.timeline({ paused: true });
        gsap.utils.toArray<HTMLElement>("[data-wave-bar]").forEach((bar, i) => {
          wave.to(
            bar,
            {
              scaleY: () => gsap.utils.random(0.08, 1) * envelope(i),
              duration: () => gsap.utils.random(0.3, 0.75),
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              repeatRefresh: true,
            },
            i * 0.012,
          );
        });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? wave.play() : wave.pause()),
        });
      });
    },
    { scope: root },
  );

  const transcript = [
    { time: "00:02", speaker: t("transcript.agent"), text: t("transcript.l1"), color: "text-ai-blue" },
    { time: "00:06", speaker: t("transcript.customer"), text: t("transcript.l2"), color: "text-ai-purple" },
    { time: "00:09", speaker: t("transcript.agent"), text: t("transcript.l3"), color: "text-ai-blue" },
  ];

  return (
    <section ref={root} id="work" className="relative">
      <div className="container-x pt-28 sm:pt-36">
        <SectionHeading
          index="03"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
          description={t("intro")}
        />
      </div>

      <div className="mt-16 sm:mt-24">
        <ScrubVideo
          clip={VIDEOS.sinfonia}
          lines={[t("reel.l1"), t("reel.l2"), t("reel.l3")]}
          caption={t("reel.caption")}
        />
      </div>

      <div
        data-cs-pin
        className="relative flex min-h-[100svh] items-center pb-6 pt-[4.5rem] sm:pb-8 sm:pt-20 lg:py-16"
      >
        <div className="container-x grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Narrative */}
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
            <div className="mb-6 hidden gap-2 pin:flex sm:mb-8">
              {STEPS.map((step) => (
                <span key={step} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <span data-cs-bar className="block h-full origin-left scale-x-0 bg-fg" />
                </span>
              ))}
            </div>
            <div className="grid gap-10">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  data-cs-step
                  className={`${stacked} ${i > 0 ? hiddenUntilScroll : ""}`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    {t(`steps.${step}.label`)}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                    {t(`steps.${step}.body`)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 hidden flex-wrap gap-2 sm:flex">
              {STACK.map((tech) => (
                <span key={tech} className="chip">
                  <TechIcon technology={tech} size={12} />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Product mockup */}
          <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
            <div className="card flex min-w-0 h-[clamp(190px,min(40svh,calc(100svh-390px)),440px)] flex-col bg-[#07070a] lg:h-[68svh] lg:max-h-[640px] nopin:h-auto">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
                style={{ background: "linear-gradient(90deg,#0894ff,#c959dd,#ff2e54,#ff9004)" }}
              />

              <header className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-2.5 text-sm font-medium text-fg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                  </span>
                  SinfonIA
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                    {t("live")}
                  </span>
                </div>
                <div className="grid overflow-hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {LAYERS.map((layer, i) => (
                    <span
                      key={layer}
                      data-cs-label
                      className={`text-right ${stacked} ${i > 0 ? hiddenUntilScroll : ""} ${i < 2 ? "nopin:hidden" : ""}`}
                    >
                      {t(`layers.${layer}`)}
                    </span>
                  ))}
                </div>
              </header>

              <div className="relative grid flex-1 overflow-hidden">
                {/* 1 — Audio */}
                <div
                  data-cs-layer
                  className={`${stacked} flex items-center justify-center gap-[3px] px-6 nopin:hidden sm:gap-1 sm:px-10`}
                >
                  {Array.from({ length: BAR_COUNT }, (_, i) => (
                    <span
                      key={i}
                      data-wave-bar
                      className={`h-[70%] w-[3px] origin-center rounded-full sm:w-1 ${i % 2 ? "hidden sm:block" : ""}`}
                      style={{
                        background: waveColor(i / (BAR_COUNT - 1)),
                        transform: `scaleY(${(envelope(i) * 0.55).toFixed(3)})`,
                      }}
                    />
                  ))}
                </div>

                {/* 2 — Transcript */}
                <div
                  data-cs-layer
                  className={`${stacked} ${hiddenUntilScroll} flex flex-col justify-center gap-4 px-5 nopin:hidden sm:gap-6 sm:px-10`}
                >
                  {transcript.map((line) => (
                    <div key={line.time} data-cs-line className="flex gap-4">
                      <span className="pt-1 font-mono text-[11px] text-subtle">{line.time}</span>
                      <div>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${line.color}`}>
                          {line.speaker}
                        </span>
                        <p className="mt-1 text-[15px] leading-snug text-fg sm:text-xl">
                          {line.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div data-cs-line className="flex items-center gap-4">
                    <span className="font-mono text-[11px] text-subtle">00:14</span>
                    <span className="chip border-ai-orange/30 bg-ai-orange/10 text-ai-orange">
                      <FiPause className="h-3 w-3" />
                      {t("transcript.silence")}
                    </span>
                  </div>
                </div>

                {/* 3 — Insights */}
                <div
                  data-cs-layer
                  className={`${stacked} ${hiddenUntilScroll} flex flex-col justify-center gap-3 p-4 sm:gap-4 sm:p-8`}
                >
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <InsightCard label={t("insights.sentiment")} value={t("insights.sentimentValue")}>
                      <Meter width="82%" color="#30d158" />
                    </InsightCard>
                    <InsightCard label={t("insights.silence")} value={t("insights.silenceValue")}>
                      <Meter width="18%" color="#ff9004" />
                    </InsightCard>
                    <InsightCard label={t("insights.resolution")} value={t("insights.resolutionValue")}>
                      <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-live/15 text-live">
                        <FiCheck className="h-3.5 w-3.5" />
                      </span>
                    </InsightCard>
                    <InsightCard label={t("insights.score")}>
                      <svg viewBox="0 0 128 38" className="h-8 w-full" fill="none" aria-hidden="true">
                        <path
                          data-cs-spark
                          d={SPARK_PATH}
                          stroke="url(#spark)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={SPARK_LENGTH}
                        />
                        <defs>
                          <linearGradient id="spark" x1="0" x2="1">
                            <stop offset="0" stopColor="#0894ff" />
                            <stop offset="1" stopColor="#c959dd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </InsightCard>
                  </div>
                  <p
                    data-cs-insight
                    className="flex items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-[13px] leading-snug text-muted sm:text-sm"
                  >
                    <FiZap className="mt-0.5 h-4 w-4 flex-shrink-0 text-ai-purple" />
                    {t("insights.tip")}
                  </p>
                </div>
              </div>

              <footer className="relative border-t border-white/[0.06] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle sm:px-7">
                {t("illustrative")}
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-cs-insight
      className="flex min-w-0 flex-col gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 sm:p-5"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-subtle sm:tracking-[0.18em]">
        {label}
      </span>
      {value && <span className="text-base font-semibold text-fg sm:text-xl">{value}</span>}
      {children}
    </div>
  );
}

function Meter({ width, color }: { width: string; color: string }) {
  return (
    <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <span
        data-cs-meter
        className="block h-full origin-left rounded-full"
        style={{ width, background: color }}
      />
    </span>
  );
}
