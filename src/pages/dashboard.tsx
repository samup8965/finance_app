import React, { useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { SideBar } from "../components/SideBar";
import { Navbar } from "../components/Navbar";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const { activeMenu } = useStateContext();
  const navigate = useNavigate();

  console.log(session);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="TopCenter">
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
            ⚙️
          </button>
        </TooltipComponent>
      </div>

      {/*Side bar*/}

      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white text-black">
          <SideBar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <SideBar />
        </div>
      )}

      {/*Nav bar*/}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
