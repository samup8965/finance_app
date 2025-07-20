import { Route } from "./RouteSelect";
import { BiTransfer } from "react-icons/bi";

const Connect = () => {
  return (
    <div className="flex sticky bottom-0 top-0 flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs">
      <div className="flex items-center justify-between">
        <Route Icon={BiTransfer} selected={false} title="Connect-Bank" />
      </div>
    </div>
  );
};

export default Connect;
