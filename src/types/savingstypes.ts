// This type matches exactly what Supabase returns
export interface SavingsGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  saved_amount: number;
  deadline: string | null;
  created_at: string;
}
// When creating a savings goal no ID or user_id
export interface NewSavingsGoal {
  goal_name: string;
  target_amount: number;
  saved_amount: number;
  created_at: string;
  deadline: string | null;
}

// HTML form input always gives us strings so we need to convert later
export interface SavingsGoalFormData {
  goal_name: string;
  target_amount: string;
  deadline: string;
}

// SavingsGoalFormData -> NewSavingsGoal -> SavingsGoal -> Display that

export interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateSavedAmount: (id: string, amount: number) => Promise<void>;
  isEditing: boolean;
  onEditToggle: (id: string | null) => void;
}
// GoalCardProps
// Takes the actual final data to display
// onEdit -> A function when the user saves edits takes the goal ID and changes to make Partial<SavingsGoal> which means some fields but not all this is async so a Promise

// On delete - called when user deletes goal just needs the goal ID also sync as its a DB call

// oneEditToggle - function to start/ stop editing null is stop so parent decides which card can edit - only one at a time

export interface AddGoalFormProps {
  onSubmit: (goalData: NewSavingsGoal) => Promise<void>;
  isSubmitting: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

// OnSubmit so a function to call when data is submitted
// isSubmitting - is the form being saved maybe show Creating.. instead of create goal
//isVisible  - should it be shown or hidden parent can control when user clicks add goal

//Ontoggle - A function to show or hide the form maybe user clicks cancel or after a sucessful submission
