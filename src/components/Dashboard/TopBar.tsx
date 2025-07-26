import { useDataContext } from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";

const TopBar = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const { isConnected, accounts } = useDataContext();
  const { signOut } = UserAuth();

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          {isConnected ? (
            <span className="text-sm font-bold block text-black">
              Hey, {accounts[0].display_name.split(" ")[0] + "!"}
            </span>
          ) : (
            <span className="text-sm font-bold block text-black">Guest</span>
          )}

          <span className="text-xs block text-stone-500">{date}</span>
        </div>
        <button
          className="bg-blue-600 text-right text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-500 ml-auto block"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default TopBar;
