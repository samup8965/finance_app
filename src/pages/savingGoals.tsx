import { useState, useEffect } from "react";
import { type SavingsGoal, type NewSavingsGoal } from "../types/savingstypes";
import { supabase } from "../supabaseClient";
import { AddGoalForm } from "../components/AddGoalForm";
import { GoalCard } from "../components/GoalCard";

export const SavingGoals = () => {
  // State management
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading your savings goals...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-white-900">Savings Goals</h1>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-600 text-whitepx-4 py-2 rounded-lg hover: bg-purple-700 transition-colors"
      >
        {showAddForm ? "Cancel" : "+Add New Goal"}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <AddGoalForm
        onSubmit={handleAddGoal}
        isSubmitting={submitting}
        isVisible={showAddForm}
        onToggle={() => setShowAddForm(!showAddForm)}
      />

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No savings goals yet</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover: text-purple-700"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            isEditing={editingGoalId === goal.id}
            onEditToggle={handleEditToggle}
          />
        ))
      )}
    </div>
  );
};
