import { CheckCircle } from 'lucide-react';

export default function GoalTracker({ goals, onToggle }) {
  return (
    <div className="space-y-2">
      {goals.map(goal => (
        <div key={goal.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <button onClick={() => onToggle(goal.id)}>
            {goal.completed && <CheckCircle className="text-green-600" />}
          </button>
          <span className={goal.completed ? 'line-through text-stone-400' : ''}>
            {goal.text}
          </span>
        </div>
      ))}
    </div>
  );
}
