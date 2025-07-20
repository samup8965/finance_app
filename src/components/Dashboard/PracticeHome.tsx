import Overview from "./Overview";
import { PracticeSideBar } from "../SideBar/PracticeSideBar";

export const PracticeHome = () => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <Overview />
    </main>
  );
};
