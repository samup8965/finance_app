import { createContext, useContext, useState } from "react";

import { type ReactNode } from "react";

interface ContextType {
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

const StateContext = createContext<ContextType>({
  activeMenu: "",
  setActiveMenu: () => {},
});

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState("");

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
