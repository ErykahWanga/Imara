export default function ProgressView({ checkins, completions }) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-stone-700">Recent Activity</h3>
  
        {completions.map((c, i) => (
          <p key={i} className="text-sm text-stone-600">
            Completed: {c.pathTitle}
          </p>
        ))}
  
        {checkins.map(([date]) => (
          <p key={date} className="text-xs text-stone-500">
            Check-in: {new Date(date).toLocaleDateString()}
          </p>
        ))}
      </div>
    );
  }
  