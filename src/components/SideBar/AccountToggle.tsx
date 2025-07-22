import { UserAuth } from "../../context/AuthContext.tsx";
import { useDataContext } from "../../context/DataContext";

export const AccountToggle = () => {
  const context = UserAuth();
  const email = context?.session?.user.email ?? "No email found";

  const { accounts, isConnected } = useDataContext();

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        {/** Place holder for google picture when you log in with google */}

        <div className="text-start">
          {isConnected ? (
            <span className="text-sm font-bold block text-black">
              {accounts[0].display_name}
            </span>
          ) : (
            <span className="text-sm font-bold block text-black">Hi,</span>
          )}

          <span className="text-xs block text-stone-500">{email}</span>
        </div>
      </button>
    </div>
  );
};
