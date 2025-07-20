import { type IconType } from "react-icons";

import { MdDashboard, MdOutlineAttachMoney } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";

export const RouteSelect = () => {
  return (
    <div className="space-y-1">
      <Route Icon={MdDashboard} selected={true} title="Dashboard" />
      <Route
        Icon={MdOutlineAttachMoney}
        selected={false}
        title="Transactions"
      />
      <Route Icon={FaPiggyBank} selected={false} title="Saving-Goals" />
      <Route Icon={BiTransfer} selected={false} title="Recurring-Payments" />
    </div>
  );
};

export const Route = ({
  selected,
  Icon,
  title,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
}) => {
  return (
    <button
      className={` flex items-center hover justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow _background-color _color] ${
        selected
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-red bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon />
      <span>{title}</span>
    </button>
  );
};
