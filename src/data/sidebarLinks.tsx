import {
  MdDashboard,
  MdOutlineAttachMoney,
  MdOutlineSavings,
  MdCreditCard,
} from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineBarChart } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";
import { BsBank2 } from "react-icons/bs";
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
        component: "transactions",
      },
      {
        name: "budgets",
        icon: <MdOutlineSavings />,
        component: "budgets",
      },
      {
        name: "bank-accounts",
        icon: <BsBank2 />,
        component: "bank-accounts",
      },
      {
        name: "credit-cards",
        icon: <MdCreditCard />,
        component: "credit-cards",
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
        component: "recurring-payments",
      },
    ],
  },
  {
    title: "Reports",
    links: [
      {
        name: "spending-trends",
        icon: <AiOutlineBarChart />,
        component: "spending-trends",
      },
      {
        name: "financial-summary",
        icon: <RiFileList3Line />,
        component: "financial-summary",
      },
    ],
  },
];
