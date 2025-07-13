import { useState } from "react";
import {
  type AddGoalFormProps,
  type SavingsGoalFormData,
  type NewSavingsGoal,
} from "../types/savingstypes";

export const AddGoalForm: React.FC<AddGoalFormProps> = ({
  onSubmit,
  isSubmitting,
  isVisible,
  onToggle,
}) => {
  const [formData, setFormData] = useState<SavingsGoalFormData>({
    goal_name: "",
    target_amount: "",
    deadline: "",
  });

  const [errors, setErrors] = useState<Partial<SavingsGoalFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (errors[name as keyof SavingsGoalFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SavingsGoalFormData> = {};

    if (!formData.goal_name.trim()) {
      newErrors.goal_name = "Goal name is required";
    }

    if (!formData.target_amount.trim()) {
      newErrors.target_amount = "Target amount is required";
    } else if (
      isNaN(Number(formData.target_amount)) ||
      Number(formData.target_amount) <= 0
    ) {
      newErrors.target_amount = "Target amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const goalData: NewSavingsGoal = {
      goal_name: formData.goal_name.trim(),
      target_amount: Number(formData.target_amount),
      saved_amount: 0, // Start with 0 saved
      deadline: formData.deadline || null,
    };

    await onSubmit(goalData);

    // Reset if Submission was successful
    setFormData({
      goal_name: "",
      target_amount: "",
      deadline: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      goal_name: "",
      target_amount: "",
      deadline: "",
    });
    setErrors({});
    onToggle();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Create New Savings Goal</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label
            htmlFor="goal_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal Name *
          </label>
          <input
            type="text"
            id="goal_name"
            name="goal_name"
            value={formData.goal_name}
            onChange={handleInputChange}
            placeholder="e.g., Trip to Spain"
            className={` text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.goal_name ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.goal_name && (
            <p className="text-red-500 text-sm mt-1">{errors.goal_name}</p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label
            htmlFor="target_amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target Amount ($) *
          </label>
          <input
            type="number"
            id="target_amount"
            name="target_amount"
            value={formData.target_amount}
            onChange={handleInputChange}
            placeholder="800"
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.target_amount ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.target_amount && (
            <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline (Optional)
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]} // Today's date as minimum
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
