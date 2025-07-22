import { useState, useEffect } from "react";
import { type SavingsGoal, type NewSavingsGoal } from "../types/savingstypes";
import { supabase } from "../supabaseClient";
import { AddGoalForm } from "../components/AddGoalForm";
import { GoalCard } from "../components/GoalCard";
import { PracticeSideBar } from "../components/SideBar/SideBar";

export const SavingGoals = () => {
  // State management
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);

  const alertStyles = {
    success:
      "bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-md",
    warning:
      "bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 shadow-md",
    error:
      "bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 shadow-md",
    info: "bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 shadow-md",
  };
  const getAlertMessage = (goal: SavingsGoal) => {
    if (!goal.deadline) return null;

    const today = new Date();
    const deadline = new Date(goal.deadline);

    const timeDiff = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const progressPercent = (goal.saved_amount / goal.target_amount) * 100;

    // Goal completed
    if (progressPercent >= 100) {
      return {
        type: "success",
        message: `🎉 "${goal.goal_name}" goal achieved!`,
      };
    }

    // Overdue
    if (daysLeft < 0) {
      return {
        type: "error",
        message: `⚠️ "${goal.goal_name}" is ${Math.abs(
          daysLeft
        )} days overdue!`,
      };
    }

    // Close to deadline
    if (daysLeft <= 2) {
      return {
        type: "warning",
        message: `⚠️ "${goal.goal_name}" deadline in ${daysLeft} days!`,
      };
    }

    // Progress milestones

    if (progressPercent >= 90) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! 90% done!`,
      };
    }

    if (progressPercent >= 80) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! 80% done!`,
      };
    }

    if (progressPercent >= 70) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! 70% done!`,
      };
    }

    if (progressPercent >= 60) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! 60% done!`,
      };
    }

    if (progressPercent >= 50) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! 50% done!`,
      };
    }

    return null;
  };

  const alertMessages = goals
    .map((goal) => getAlertMessage(goal))
    .filter((message) => message !== null);

  useEffect(() => {
    if (alertMessages.length > 0 && showAlerts) {
      const timer = setTimeout(() => {
        setShowAlerts(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessages, showAlerts]);

  const fetchGoals = async () => {
    try {
      setLoading(true); // SHow loading state
      setError(null); // Clear any previous errors

      // Select all columns order by created at - newest first

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch goals");
    } finally {
      setLoading(false); // Need to always set loading back to false no matter what
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (goalData: NewSavingsGoal) => {
    try {
      setSubmitting(true); // Diable the form maybe show creating

      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Current user:", user);

      // Here we are inserting a new row square brackets due to supabase docs expects array of rows
      //.select - so after inserting return the full list
      if (user != null) {
        const { data, error } = await supabase
          .from("savings_goals")
          .insert([
            {
              ...goalData,
              user_id: user.id,
            },
          ])
          .select();

        if (error) throw error;

        // Check if data exists so not null or anything and also check its not empty
        if (data && data[0]) {
          // Use prev to take previous most up to date state
          setGoals((prev) => [data[0], ...prev]);
          setShowAddForm(false);
        }
      } else {
        setError("User id is null try logging in again");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      // Updating one or more colums of a row with updates object and only the one where the id equals the one I give
      const { error } = await supabase
        .from("savings_goals")
        .update(updates)
        .eq("id", id);

      if (error) {
        throw error;
      }
      // Loops through overrides the exisiting goal with any fields from updates
      // We also manage state locally instead of refectching better for UX
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
      );

      setEditingGoalId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from local state
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falied to delete goal");
    }
  };

  const handleEditToggle = (id: string | null) => {
    setEditingGoalId(id);
  };

  const handleUpdateSavedAmount = async (goalId: string, newAmount: number) => {
    try {
      const { error } = await supabase
        .from("savings_goals")
        .update({ saved_amount: newAmount })
        .eq("id", goalId)
        .select();

      if (error) {
        throw error;
      }

      // Update local state
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, saved_amount: newAmount } : goal
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falied to update saved amount"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-black">Loading your savings goals...</div>
      </div>
    );
  }

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr] bg-stone-100">
      <PracticeSideBar />
      <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">Saving Goals</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showAddForm ? "Cancel" : "+ Add New Goal"}
          </button>
        </div>

        {/* Banner Sections */}
        {alertMessages.length > 0 &&
          showAlerts &&
          alertMessages.map((message) => (
            <div
              className={`${
                alertStyles[message.type as keyof typeof alertStyles]
              } px-4 py-3 rounded-lg mb-2`}
            >
              {message.message}
            </div>
          ))}

        {/* Error Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form Section */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <AddGoalForm
              onSubmit={handleAddGoal}
              isSubmitting={submitting}
              isVisible={showAddForm}
              onToggle={() => setShowAddForm(!showAddForm)}
            />
          </div>
        )}

        {/* Goals Section */}
        <div className="goals-section">
          {goals.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white-900 mb-2">
                No saving goals yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first goal to start tracking your savings progress
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            /* Goals Grid */
            <div className="goals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="goal-card">
                  <GoalCard
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    onUpdateSavedAmount={handleUpdateSavedAmount}
                    isEditing={editingGoalId === goal.id}
                    onEditToggle={handleEditToggle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
