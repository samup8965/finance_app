import { AccountToggle } from "./AccountToggle";
import Connect from "./Connect";
import { RouteSelect } from "./RouteSelect";

export const PracticeSideBar = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AccountToggle />
        <RouteSelect />
      </div>

      <Connect />
    </div>
  );
};
