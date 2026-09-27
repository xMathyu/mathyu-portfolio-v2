"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface IntroState {
  introDone: boolean;
  setIntroDone: (done: boolean) => void;
}

const IntroContext = createContext<IntroState>({
  introDone: true,
  setIntroDone: () => {},
});

/** Lets the preloader tell the hero (and nav) when to play their entrance. */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const value = useMemo(() => ({ introDone, setIntroDone }), [introDone]);

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export const useIntro = () => useContext(IntroContext);
