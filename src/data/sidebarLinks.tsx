import { MdDashboard, MdOutlineAttachMoney } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineBarChart } from "react-icons/ai";

import { type ReactElement } from "react";

// -----------------------
// Types
// -----------------------

export interface SidebarLink {
  name: string;
  icon: ReactElement;
  component: string;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

// -----------------------
// Data
// -----------------------

export const links: SidebarSection[] = [
  {
    title: "Dashboard",
    links: [
      {
        name: "overview",
        icon: <MdDashboard />,
        component: "Dashboard",
      },
    ],
  },
  {
    title: "Accounts",
    links: [
      {
        name: "transactions",
        icon: <MdOutlineAttachMoney />,
        component: "practice",
      },
    ],
  },
  {
    title: "Planning",
    links: [
      {
        name: "Saving-Goals",
        icon: <FaPiggyBank />,
        component: "savingGoals",
      },
      {
        name: "recurring-payments",
        icon: <BiTransfer />,
        component: "recurringPayments",
      },
    ],
  },
  {
    title: "Reports",
    links: [
      {
        name: "spending-trends",
        icon: <AiOutlineBarChart />,
        component: "spendingTrends",
      },
    ],
  },
];
