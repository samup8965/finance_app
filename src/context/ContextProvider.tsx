import { createContext, useContext, useState } from "react";

import { type ReactNode } from "react";

interface ContextType {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  profileClicked: boolean;
  setProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const StateContext = createContext<ContextType>({
  activeMenu: false,
  setActiveMenu: () => {},
  profileClicked: false,
  setProfileClicked: () => {},
  screenSize: undefined,
  setScreenSize: () => {},
});

// Could implement initial state for further navugation features for now just doing profile

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [profileClicked, setProfileClicked] = useState(false);

  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        profileClicked,
        setProfileClicked,
        screenSize,
        setScreenSize,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
