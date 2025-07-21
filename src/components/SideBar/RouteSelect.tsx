import { type IconType } from "react-icons";

import { MdDashboard, MdOutlineAttachMoney } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export const RouteSelect = () => {
  return (
    <div className="space-y-1">
      <Route
        Icon={MdDashboard}
        selected={true}
        title="Overview"
        component="Dashboard"
      />
      <Route
        Icon={MdOutlineAttachMoney}
        selected={false}
        title="Transactions"
        component="Transactions"
      />
      <Route
        Icon={FaPiggyBank}
        selected={false}
        title="Saving-Goals"
        component="savingGoals"
      />
      <Route
        Icon={BiTransfer}
        selected={false}
        title="Recurring-Payments"
        component="recurringPayments"
      />
      <Route
        Icon={BiTransfer}
        selected={false}
        title="Spending-Trends"
        component="spendingTrends"
      />
    </div>
  );
};

export const Route = ({
  selected,
  Icon,
  title,
  component,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
  component: string;
}) => {
  const navigate = useNavigate();
  return (
    <button
      className={` flex items-center hover justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow _background-color _color] cursor-pointer ml-* ${
        selected
          ? "bg-white text-stone-950 shadow"
          : " hover:bg-stone-300 bg-transparent text-stone-500 shadow-none"
      }`}
      onClick={() => navigate(`/${component}`)}
    >
      <Icon />
      <span>{title}</span>
    </button>
  );
};
