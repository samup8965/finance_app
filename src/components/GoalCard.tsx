import { type GoalCardProps } from "../types/savingstypes";
import { Trash2, Edit3, Check, X } from "lucide-react";
import { useState } from "react";

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  isEditing,
  onEditToggle,
}) => {
  const [editValues, setEditValues] = useState({
    goal_name: goal.goal_name,
    target_amount: goal.target_amount.toString(),
    deadline: goal.deadline || "",
  });

  const progressPercentage = Math.min(
    (goal.saved_amount / goal.target_amount) * 100,
    100
  );

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditStart = () => {
    setEditValues({
      goal_name: goal.goal_name,
      target_amount: goal.target_amount.toString(),
      deadline: goal.deadline || "",
    });
    onEditToggle(goal.id);
  };

  const handleEditCancel = () => {
    onEditToggle(null);
  };

  const handleEditSave = async () => {
    const updates: any = {};

    if (editValues.goal_name !== goal.goal_name) {
      updates.goal_name = editValues.goal_name;
    }

    if (Number(editValues.target_amount) !== goal.target_amount) {
      updates.target_amount = Number(editValues.target_amount);
    }

    if (editValues.deadline !== (goal.deadline || "")) {
      updates.deadline = editValues.deadline || null;
    }

    if (Object.keys(updates).length > 0) {
      await onEdit(goal.id, updates);
    } else {
      onEditToggle(null);
    }
  };

  const handleDelete = () => {
    onDelete(goal.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editValues.goal_name}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  goal_name: e.target.value,
                }))
              }
              className="text-xl font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              autoFocus
            />
          ) : (
            <h3 className="text-xl font-semibold text-gray-900">
              {goal.goal_name}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSave}
                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                title="Save changes"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleEditCancel}
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditStart}
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                title="Edit goal"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Delete goal"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {formatCurrency(goal.saved_amount)} of{" "}
            {formatCurrency(goal.target_amount)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isOverdue ? "bg-orange-500" : "bg-blue-600"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% complete
          </span>
          {goal.target_amount > goal.saved_amount && (
            <span className="text-xs text-gray-500">
              {formatCurrency(goal.target_amount - goal.saved_amount)} remaining
            </span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2">
        {/* Target Amount (editable) */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Target:</span>
          {isEditing ? (
            <input
              type="number"
              value={editValues.target_amount}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  target_amount: e.target.value,
                }))
              }
              className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-right w-24"
              min="0"
              step="0.01"
            />
          ) : (
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(goal.target_amount)}
            </span>
          )}
        </div>

        {/* Deadline */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Deadline:</span>
          {isEditing ? (
            <input
              type="date"
              value={editValues.deadline}
              onChange={(e) =>
                setEditValues((prev) => ({ ...prev, deadline: e.target.value }))
              }
              className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              min={new Date().toISOString().split("T")[0]}
            />
          ) : (
            <span
              className={`text-sm font-medium ${
                isOverdue ? "text-orange-600" : "text-gray-900"
              }`}
            >
              {goal.deadline ? (
                <>
                  {formatDate(goal.deadline)}
                  {isOverdue && (
                    <span className="ml-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Overdue
                    </span>
                  )}
                </>
              ) : (
                "No deadline"
              )}
            </span>
          )}
        </div>

        {/* Created Date */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Created:</span>
          <span className="text-sm text-gray-500">
            {formatDate(goal.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
