import React, { createContext, useContext } from "react";

const DIContext = createContext<unknown>(null);

interface DIProviderProps<T> {
  children: React.ReactNode;
  services: T;
}

export const DIProvider = <T,>({
  children,
  services,
}: DIProviderProps<T>): React.ReactElement => {
  return <DIContext.Provider value={services}>{children}</DIContext.Provider>;
};

export const useDependency = <T,>(): T => {
  const context = useContext(DIContext);

  if (!context) {
    throw new Error("useDependency must be used within DIProvider");
  }

  return context as T;
};
