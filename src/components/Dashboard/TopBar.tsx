import { useDataContext } from "../../context/DataContext";

const TopBar = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const { isConnected, accounts } = useDataContext();

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
      </div>
    </div>
  );
};

export default TopBar;
