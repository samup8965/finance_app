import { AccountToggle } from "./AccountToggle";
import Connect from "./Connect";
import { RouteSelect } from "./RouteSelect";

export const PracticeSideBar = () => {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <RouteSelect />
      </div>

      <Connect />
    </div>
  );
};
