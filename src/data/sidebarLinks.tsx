import {
  MdDashboard,
  MdOutlineAttachMoney,
  MdOutlineSavings,
  MdCreditCard,
} from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineBarChart, AiOutlineCalendar } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";
import { BsBank2 } from "react-icons/bs";
import { type ReactElement } from "react";

// -----------------------
// Types
// -----------------------

export interface SidebarLink {
  name: string;
  icon: ReactElement;
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
      },
    ],
  },
  {
    title: "Accounts",
    links: [
      {
        name: "transactions",
        icon: <MdOutlineAttachMoney />,
      },
      {
        name: "budgets",
        icon: <MdOutlineSavings />,
      },
      {
        name: "bank-accounts",
        icon: <BsBank2 />,
      },
      {
        name: "credit-cards",
        icon: <MdCreditCard />,
      },
    ],
  },
  {
    title: "Planning",
    links: [
      {
        name: "savingGoals",
        icon: <FaPiggyBank />,
      },
      {
        name: "recurring-payments",
        icon: <BiTransfer />,
      },
      {
        name: "calendar",
        icon: <AiOutlineCalendar />,
      },
    ],
  },
  {
    title: "Reports",
    links: [
      {
        name: "spending-trends",
        icon: <AiOutlineBarChart />,
      },
      {
        name: "financial-summary",
        icon: <RiFileList3Line />,
      },
    ],
  },
];
