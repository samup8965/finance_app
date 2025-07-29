import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useDataContext } from "../../context/DataContext";
import { type SavingsGoal } from "../../types/savingstypes";

const SavingsGoals = () => {
  const { setError } = useDataContext();

  // States for rendering saving goals
  const [savingGoals, setSavingGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch for getting saving goals from database
  useEffect(() => {
    const fetchSavingGoals = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data, error } = await supabase
          .from("savings_goals")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2);

        if (error) {
          throw error;
        }
        setSavingGoals(data || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingGoals();
  }, []);

  const renderGoal = (goal: SavingsGoal) => {
    const progressPercent =
      ((goal.saved_amount ?? 0) / (goal.target_amount ?? 1)) * 100;

    return (
      <div key={goal.id} className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {goal.goal_name}
          </span>
          <span className="font-medium dark:text-gray-900">
            £{goal.saved_amount} / £{goal.target_amount}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round((goal.saved_amount / goal.target_amount) * 100)}% complete
          • £{goal.target_amount - goal.saved_amount} remaining
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-secondary-dark-bg rounded-2xl p-6 shadow-sm border dark:border-gray-200 h-[270px]">
      <h4 className="font-semibold text-gray-900 dark:text-gray-800 mb-4">
        Saving Goals
      </h4>

      <div className="space-y-4">
        {loading ? (
          // Loading state for two goals
          <>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </>
        ) : savingGoals.length > 0 ? (
          savingGoals.map(renderGoal)
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">🎯</span>
            </div>
            <p className="text-gray-600 dark:text-gray-600 text-sm font-medium">
              No saving goals yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;
