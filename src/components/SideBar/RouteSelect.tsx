import { type IconType } from "react-icons";
import { useStateContext } from "../../context/ContextProvider";

import { MdDashboard, MdOutlineAttachMoney } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const RouteSelect = () => {
  const { activeMenu } = useStateContext();

  return (
    <div className="space-y-1">
      <Route
        Icon={MdDashboard}
        title="Overview"
        selected={activeMenu === "Overview"}
        component="Dashboard"
      />
      <Route
        Icon={MdOutlineAttachMoney}
        selected={activeMenu === "Transactions"}
        title="Transactions"
        component="Transactions"
      />
      <Route
        Icon={FaPiggyBank}
        selected={activeMenu === "Saving-Goals"}
        title="Saving-Goals"
        component="savingGoals"
      />
      <Route
        Icon={AiOutlineSchedule}
        selected={activeMenu === "Recurring-Payments"}
        title="Recurring-Payments"
        component="recurringPayments"
      />
      <Route
        Icon={FaChartPie}
        selected={activeMenu === "Spending-Trends"}
        title="Spending-Trends"
        component="spendingTrends"
      />
    </div>
  );
};

// Using inline type annotation for props here
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
  const { setActiveMenu } = useStateContext();
  return (
    <button
      className={` flex items-center hover justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow _background-color _color] cursor-pointer ml-* ${
        selected
          ? "bg-white text-stone-950 shadow"
          : " hover:bg-stone-300 bg-transparent text-stone-500 shadow-none"
      }`}
      onClick={() => {
        if (title !== "Connect-Bank") {
          navigate(`/${component}`);
        }
        setActiveMenu(title);
      }}
    >
      <Icon />
      <span>{title}</span>
    </button>
  );
};
