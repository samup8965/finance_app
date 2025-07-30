import { Route } from "./RouteSelect";
import { RiBankLine } from "react-icons/ri";
import { useDataContext } from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const Connect = () => {
  const { connectionStatus, setConnectionStatus } = useDataContext();

  const { session } = UserAuth();

  const handleConnectBank = () => {
    window.location.href = window.location.href =
      "https://auth.truelayer.com/?response_type=code&client_id=personalfinancetracker-561293&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=https://finance-app-steel-seven.vercel.app/truelayercallback&providers=uk-ob-all%20uk-oauth-all";
  };

  const handleDisconnect = async () => {
    console.log("handle disconnect called");
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("bank_connection")
      .delete()
      .eq("user_id", session.user.id);

    console.log("Delete result:", { error, data });

    if (error) {
      console.error("Failed to disconnect:", error.message);
      return;
    }

    // Update context and UI
    setConnectionStatus("disconnected");
  };

  return connectionStatus === "connected" ? (
    <div
      className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs cursor-pointer"
      onClick={handleDisconnect}
    >
      <div className="flex items-center justify-between">
        <Route
          Icon={RiBankLine}
          selected={false}
          title="Disconnect"
          component="Connect-Bank"
        />
      </div>
    </div>
  ) : (
    <div
      className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs cursor-pointer"
      onClick={handleConnectBank}
    >
      <div className="flex items-center justify-between">
        <Route
          Icon={RiBankLine}
          selected={false}
          title="Connect-Bank"
          component="Connect-Bank"
        />
      </div>
    </div>
  );
};

export default Connect;
