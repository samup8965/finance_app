import { Route } from "./RouteSelect";
import { BiTransfer } from "react-icons/bi";

const Connect = () => {
  const handleConnectBank = () => {
    window.location.href =
      "https://auth.truelayer.com/?response_type=code&client_id=personalfinancetracker-561293&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=http://localhost:5173/truelayercallback&providers=uk-ob-all%20uk-oauth-all";
  };
  return (
    <div
      className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs "
      onClick={handleConnectBank}
    >
      <div className="flex items-center justify-between">
        <div>
          <Route Icon={BiTransfer} selected={false} title="Connect-Bank" />
        </div>
      </div>
    </div>
  );
};

export default Connect;
