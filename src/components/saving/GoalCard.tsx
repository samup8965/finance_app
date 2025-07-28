import { type GoalCardProps } from "../../types/savingstypes";
import { Trash2, Edit3, Check, X } from "lucide-react";
import { useState } from "react";

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  isEditing,
  onUpdateSavedAmount,
  onEditToggle,
}) => {
  const [editValues, setEditValues] = useState({
    goal_name: goal.goal_name,
    target_amount: goal.target_amount.toString(),
    deadline: goal.deadline || "",
  });

  const [isEditingSavedAmount, setIsEditingSavedAmount] = useState(false);
  const [tempSavedAmount, setTempSavedAmount] = useState(
    goal.saved_amount.toString()
  );

  const progressPercentage = Math.min(
    (goal.saved_amount / goal.target_amount) * 100,
    100
  );

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
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

  // Handling the editing of saved amount

  const handleSavedAMountEditStart = () => {
    setTempSavedAmount(goal.saved_amount.toString());
    setIsEditingSavedAmount(true);
  };

  const handleSavedAmountSave = async () => {
    const newAmount = Number(tempSavedAmount);
    if (newAmount !== goal.saved_amount && newAmount >= 0) {
      await onUpdateSavedAmount(goal.id, newAmount);
    }
    setIsEditingSavedAmount(false);
  };

  const handleSavedAmountCancel = () => {
    setTempSavedAmount(goal.saved_amount.toString());
    setIsEditingSavedAmount(false);
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
          <span className="text-sm font-medium text-gray-700">Progress </span>
          {isEditingSavedAmount ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={tempSavedAmount}
                onChange={(e) => setTempSavedAmount(e.target.value)}
                className="text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-right w-20"
                min="0"
                step="0.01"
                autoFocus
              />

              <span className="text-sm text-gray-600">
                {" "}
                of {formatCurrency(goal.target_amount)}
              </span>
              <button
                onClick={handleSavedAmountSave}
                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                title="Save progress"
              >
                <Check size={14} />
              </button>

              <button
                onClick={handleSavedAmountCancel}
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex iems-center gap-1">
              <span className="text-sm text-gray-600">
                {" "}
                {formatCurrency(goal.saved_amount)} of{" "}
                {formatCurrency(goal.target_amount)}
              </span>

              <button
                onClick={handleSavedAMountEditStart}
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                title="Edit progress"
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/*Progress Section*/}

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Details Section */}
      <div
        className="space-y-2 py-4
      "
      >
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
