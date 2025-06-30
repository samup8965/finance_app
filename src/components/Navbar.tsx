import React from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { AiOutlineMenu } from "react-icons/ai";
import { useStateContext } from "../context/ContextProvider";
import { MdKeyboardArrowDown } from "react-icons/md";

// Interface for NavButton props
interface NavButtonProps {
  title: string;
  customFunc: () => void;
  icon: React.ReactNode;
  color?: string;
  dotColor?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {icon}
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
    </button>
  </TooltipComponent>
);

export const Navbar: React.FC = () => {
  const { activeMenu, setActiveMenu } = useStateContext();

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() =>
          setActiveMenu((prevActiveMenu: boolean) => !prevActiveMenu)
        }
        color="blue"
        icon={<AiOutlineMenu />}
      />

      <TooltipComponent content="Profile" position="BottomCenter">
        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded -lg"
          onClick={() => handleClick("userProfile")}
        >
          <p>
            <span className="text-gray-400 text-14"> Hi, </span>{" "}
            <span className="text-gray-400 text-14 font-bold ml-1 text-14">
              Michael
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>
      </TooltipComponent>
    </div>
  );
};
