"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { wrap } from "popmotion";
import { useTranslations } from "next-intl";

const companies = [
  { id: 1, name: "Entel", logo: "/logos/entel-logo.png" },
  { id: 2, name: "309 Technology", logo: "/logos/309.png" },
  { id: 3, name: "Encora", logo: "/logos/encora.png" },
  { id: 4, name: "Serverli", logo: "/logos/serverli.png" },
  { id: 5, name: "MDP", logo: "/logos/mdp.png" },
  { id: 6, name: "AOS", logo: "/logos/aos.png" },
  { id: 7, name: "Interbank", logo: "/logos/interbank.png" },
  { id: 8, name: "Niubiz", logo: "/logos/niubiz.png" },
  { id: 9, name: "Pacifico", logo: "/logos/pacifico.svg" },
  { id: 10, name: "Scotiabank", logo: "/logos/scotiabank.png" },
];

export default function WorkCarouselSection() {
  const t = useTranslations("WorkCarouselSection");
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const autoX = useMotionValue(0);
  const dragX = useMotionValue(0);

  const inputs = [autoX, dragX] as [MotionValue<number>, MotionValue<number>];

  const totalX: MotionValue<number> = useTransform(
    inputs,
    (latestValues: number[]) => {
      const [a, d] = latestValues;
      return wrap(-trackWidth, 0, a + d);
    },
  );

  const isDragging = useRef(false);

  const onLoadRef = (div: HTMLDivElement) => {
    if (div && !trackRef.current) {
      trackRef.current = div;
      const scrollW = div.scrollWidth / 2;
      setTrackWidth(scrollW);
    }
  };

  useAnimationFrame((t, delta) => {
    if (!isDragging.current && trackWidth > 0) {
      const speed = 50;
      const move = -speed * (delta / 1000);
      autoX.set(autoX.get() + move);
    }
  });

  return (
    <section id="work" className="relative py-24 overflow-hidden">
      {/* Subtle divider line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
            {t("sectionSubtitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient">
            {t("sectionTitle")}
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <motion.div
            ref={onLoadRef}
            className="flex items-center space-x-6 sm:space-x-12"
            style={{ x: totalX }}
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{ left: -99999, right: 99999 }}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDrag={(event, info) => {
              dragX.set(info.offset.x);
            }}
            onDragEnd={(event, info) => {
              isDragging.current = false;
              autoX.set(autoX.get() + info.offset.x);
              dragX.set(0);
            }}
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 glass-light rounded-xl p-3 sm:p-4 hover:glow transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={120}
                  height={60}
                  draggable={false}
                  className="object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 w-[80px] h-[40px] sm:w-[120px] sm:h-[60px]"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
    </section>
  );
}
