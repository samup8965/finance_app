import { PracticeSideBar } from "../SideBar/SideBar";

import Overview from "./Overview";

// Rmoved the signout features for now

const Dashboard = () => {
  // const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   try {
  //     await signOut();
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <Overview />
    </main>
  );
};

export default Dashboard;
