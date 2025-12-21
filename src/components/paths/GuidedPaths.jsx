import React from 'react';
import { AlertCircle, Calendar, CheckCircle, Moon } from 'lucide-react';

const GuidedPaths = ({ onSelectPath }) => {
  const paths = [
    {
      id: 'overwhelmed',
      title: 'I feel overwhelmed',
      description: 'Step back and create some space',
      icon: AlertCircle,
      steps: [
        'Write down three things making you feel scattered right now',
        'Pick the smallest one. Just one.',
        'Break that one thing into a 10-minute task',
        'Do only that task, then stop',
        'Notice: you moved. That counts.'
      ]
    },
    {
      id: 'structure',
      title: 'I need structure',
      description: 'Build a simple daily rhythm',
      icon: Calendar,
      steps: [
        'Choose one time you will wake up this week',
        'Choose one simple morning action (stretch, water, window)',
        'Choose one anchor for your day (meal time, walk, work block)',
        'Write it down somewhere visible',
        'Try it tomorrow. Just tomorrow.',
        'Check in after three days—adjust if needed'
      ]
    },
    {
      id: 'income',
      title: 'I want my first income',
      description: 'Start with what you have',
      icon: CheckCircle,
      steps: [
        'List three skills you already use (even if basic)',
        'Pick one that people around you need help with',
        'Reach out to one person you know who might need this',
        'Offer to help them once, for a small amount or barter',
        'After you complete it, ask: what went well?',
        'Do it one more time. You have started.'
      ]
    },
    {
      id: 'stuck',
      title: "I'm stuck and tired",
      description: 'Rest first, then one small step',
      icon: Moon,
      steps: [
        'Give yourself permission to rest today',
        'Do one thing that feels like care (nap, walk, water, music)',
        'Tomorrow, write: What would "a little better" look like?',
        'Choose the smallest version of that',
        'Try it. If it does not work, try something gentler.',
        'You are not behind. You are here.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-stone-800">Where are you right now?</h2>
        <p className="text-stone-500 text-sm">Choose what feels true today</p>
      </div>

      <div className="grid gap-4">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <button
              key={path.id}
              onClick={() => onSelectPath(path)}
              className="bg-white p-6 rounded-2xl border-2 border-stone-100 hover:border-amber-200 transition-all text-left space-y-2 group"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg text-stone-800 group-hover:text-stone-900">{path.title}</h3>
                  <p className="text-sm text-stone-500">{path.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GuidedPaths;