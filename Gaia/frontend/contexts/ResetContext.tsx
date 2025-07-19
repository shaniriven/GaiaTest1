import { createContext, useContext, useState } from "react";

type ResetContextType = {
  resetTrigger: number;
  triggerReset: () => void;
};

const ResetContext = createContext<ResetContextType>({
  resetTrigger: 0,
  triggerReset: () => {},
});

export const ResetProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetTrigger, setResetTrigger] = useState(0);

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <ResetContext.Provider value={{ resetTrigger, triggerReset }}>
      {children}
    </ResetContext.Provider>
  );
};

export const useReset = () => useContext(ResetContext);
