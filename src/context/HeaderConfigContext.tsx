"use client";

import { createContext, useContext, useEffect, useState } from "react";

type HeaderConfigValue = { sticky: boolean; setSticky: (v: boolean) => void };

export const HeaderConfigContext = createContext<HeaderConfigValue>({
  sticky: true,
  setSticky: () => {},
});

export function HeaderConfigProvider({ children }: { children: React.ReactNode }) {
  const [sticky, setSticky] = useState(true);
  return (
    <HeaderConfigContext.Provider value={{ sticky, setSticky }}>
      {children}
    </HeaderConfigContext.Provider>
  );
}

export function HeaderConfig({ sticky = true }: { sticky?: boolean }) {
  const { setSticky } = useContext(HeaderConfigContext);
  useEffect(() => {
    setSticky(sticky);
    return () => setSticky(true);
  }, [sticky, setSticky]);
  return null;
}
