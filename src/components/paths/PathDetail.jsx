import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { storage } from '../../utils/storage';

const PathDetail = ({ path, onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < path.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    const userEmail = storage.get('imara_current_user').email;
    const completions = storage.get('imara_path_completions') || {};
    
    if (!completions[userEmail]) completions[userEmail] = [];
    
    completions[userEmail].push({
      pathId: path.id,
      pathTitle: path.title,
      completedAt: new Date().toISOString(),
      stepsCompleted: completedSteps.length + 1
    });
    
    storage.set('imara_path_completions', completions);
    onComplete();
  };

  const Icon = path.icon;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-stone-500 hover:text-stone-700 text-sm transition-colors flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-light text-stone-800">{path.title}</h2>
        </div>
        <p className="text-stone-500">{path.description}</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-amber-900">Step {currentStep + 1} of {path.steps.length}</span>
          <span className="text-xs text-amber-700">{completedSteps.length} completed</span>
        </div>

        <p className="text-lg text-stone-800 leading-relaxed">{path.steps[currentStep]}</p>

        {currentStep < path.steps.length - 1 ? (
          <button
            onClick={handleStepComplete}
            className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors"
          >
            Next step
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition-colors"
          >
            Complete path
          </button>
        )}
      </div>

      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full text-stone-500 hover:text-stone-700 text-sm transition-colors"
        >
          Previous step
        </button>
      )}

      <div className="flex gap-1 justify-center pt-4">
        {path.steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors ${
              idx <= currentStep ? 'bg-amber-400' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PathDetail;