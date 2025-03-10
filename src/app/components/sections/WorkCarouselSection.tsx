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
  { id: 1, name: "AOS", logo: "/logos/aos.png" },
  { id: 2, name: "Encora", logo: "/logos/encora.png" },
  { id: 3, name: "Interbank", logo: "/logos/interbank.png" },
  { id: 4, name: "MDP", logo: "/logos/mdp.png" },
  { id: 5, name: "Niubiz", logo: "/logos/niubiz.png" },
  { id: 6, name: "Pacifico", logo: "/logos/pacifico.svg" },
  { id: 7, name: "Serverli", logo: "/logos/serverli.png" },
  { id: 8, name: "Scotiabank", logo: "/logos/scotiabank.png" },
];

export default function WorkCarouselSection() {
  const t = useTranslations("WorkCarouselSection");
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  // Valor para el auto-scroll
  const autoX = useMotionValue(0);
  // Valor para el offset del drag manual
  const dragX = useMotionValue(0);

  // Aquí tipamos el array como una tupla de 2 MotionValue<number>
  const inputs = [autoX, dragX] as [MotionValue<number>, MotionValue<number>];

  // Combinamos ambos valores y aplicamos wrap para crear el loop infinito
  const totalX: MotionValue<number> = useTransform(
    inputs,
    (latestValues: number[]) => {
      const [a, d] = latestValues;
      return wrap(-trackWidth, 0, a + d);
    }
  );

  const isDragging = useRef(false);

  const onLoadRef = (div: HTMLDivElement) => {
    if (div && !trackRef.current) {
      trackRef.current = div;
      const scrollW = div.scrollWidth / 2;
      setTrackWidth(scrollW);
    }
  };

  // Auto-scroll
  useAnimationFrame((t, delta) => {
    if (!isDragging.current && trackWidth > 0) {
      const speed = 50; // pixeles/segundo
      const move = -speed * (delta / 1000);
      autoX.set(autoX.get() + move);
    }
  });

  return (
    <section
      id="work"
      className="relative py-16 bg-background dark:bg-foreground overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-brand-500 dark:text-brand-200 text-center mb-8">
          {t("sectionTitle")}
        </h2>

        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background dark:from-foreground z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background dark:from-foreground z-10 pointer-events-none" />

          <motion.div
            ref={onLoadRef}
            className="flex items-center space-x-8"
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
              // Suma el desplazamiento manual al autoX
              autoX.set(autoX.get() + info.offset.x);
              dragX.set(0);
            }}
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={150}
                  height={80}
                  draggable={false}
                  className="object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
