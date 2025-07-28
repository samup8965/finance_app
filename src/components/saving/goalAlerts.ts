import { type SavingsGoal } from "../../types/savingstypes";

export type AlertType = "success" | "warning" | "error" | "info";

export interface GoalAlert {
  type: AlertType;
  message: string;
}

export const alertStyles = {
  success:
    "bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 shadow-md",
  warning:
    "bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 shadow-md",
  error:
    "bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 shadow-md",
  info: "bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 shadow-md",
};

// Using as const for strict immutable properties
const PROGRESS_MILESTONES = [90, 80, 70, 60, 50] as const;

const DEADLINE_WARNING_DAYS = 2;
const ALERT_DISPLAY_DURATION = 5000;

export const getAlertMessage = (goal: SavingsGoal) => {
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
      message: `⚠️ "${goal.goal_name}" is ${Math.abs(daysLeft)} days overdue!`,
    };
  }

  // Close to deadline
  if (daysLeft <= DEADLINE_WARNING_DAYS) {
    return {
      type: "warning",
      message: `⚠️ "${goal.goal_name}" deadline in ${daysLeft} days!`,
    };
  }

  for (const milestone of PROGRESS_MILESTONES) {
    if (progressPercent >= milestone) {
      return {
        type: "info",
        message: `🔥 "${goal.goal_name}" is almost complete! ${milestone}% done!`,
      };
    }
  }

  return null;
};

export const generateAlertMessages = (goals: SavingsGoal[]): GoalAlert[] => {
  return goals
    .map(getAlertMessage)
    .filter((message): message is GoalAlert => message !== null);
};

export { ALERT_DISPLAY_DURATION };
