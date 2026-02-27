"use client";

import { createContext, useContext } from "react";

interface AIEmailContextType {
  hasAIAccess: boolean;
}

export const AIEmailContext = createContext<AIEmailContextType>({ hasAIAccess: false });

export const useAIEmailAccess = () => useContext(AIEmailContext);
