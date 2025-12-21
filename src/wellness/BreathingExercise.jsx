import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState('breatheIn');
  const [timeLeft, setTimeLeft] = useState(4);
  const [totalTime, setTotalTime] = useState(0);

  const exercises = [
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Calming technique for stress relief',
      pattern: [
        { phase: 'breatheIn', duration: 4, text: 'Breathe In', color: 'bg-blue-500' },
        { phase: 'hold', duration: 7, text: 'Hold', color: 'bg-blue-400' },
        { phase: 'breatheOut', duration: 8, text: 'Breathe Out', color: 'bg-blue-300' }
      ]
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'For focus and concentration',
      pattern: [
        { phase: 'breatheIn', duration: 4, text: 'Breathe In', color: 'bg-green-500' },
        { phase: 'hold', duration: 4, text: 'Hold', color: 'bg-green-400' },
        { phase: 'breatheOut', duration: 4, text: 'Breathe Out', color: 'bg-green-300' },
        { phase: 'hold', duration: 4, text: 'Hold', color: 'bg-green-200' }
      ]
    },
    {
      id: 'relaxing',
      name: 'Relaxing Breath',
      description: 'Simple deep breathing',
      pattern: [
        { phase: 'breatheIn', duration: 5, text: 'Breathe In', color: 'bg-purple-500' },
        { phase: 'breatheOut', duration: 5, text: 'Breathe Out', color: 'bg-purple-300' }
      ]
    }
  ];

  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);

  useEffect(() => {
    let interval;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      const currentPattern = selectedExercise.pattern;
      const currentIndex = currentPattern.findIndex(p => p.phase === cycle);
      const nextIndex = (currentIndex + 1) % currentPattern.length;
      
      setCycle(currentPattern[nextIndex].phase);
      setTimeLeft(currentPattern[nextIndex].duration);
      setTotalTime(prev => prev + 1);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, cycle, selectedExercise]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCycle(selectedExercise.pattern[0].phase);
    setTimeLeft(selectedExercise.pattern[0].duration);
    setTotalTime(0);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setIsActive(false);
    setCycle(exercise.pattern[0].phase);
    setTimeLeft(exercise.pattern[0].duration);
    setTotalTime(0);
  };

  const getCurrentPhase = () => {
    return selectedExercise.pattern.find(p => p.phase === cycle);
  };

  const currentPhase = getCurrentPhase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Wind className="w-5 h-5 text-amber-600" />
          Breathing Exercise
        </h3>
        <span className="text-xs text-stone-500">
          {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Exercise Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => handleExerciseSelect(exercise)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedExercise.id === exercise.id
                ? 'bg-amber-100 text-amber-700'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {exercise.name}
          </button>
        ))}
      </div>

      {/* Breathing Animation */}
      <div className="flex flex-col items-center justify-center py-8">
        <div
          className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000 ${
            currentPhase?.color || 'bg-blue-100'
          }`}
          style={{
            transform: `scale(${cycle === 'breatheIn' ? 1.2 : cycle === 'breatheOut' ? 0.8 : 1})`,
            opacity: cycle === 'hold' ? 0.8 : 1
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-light text-white mb-2">
              {timeLeft}
            </div>
            <div className="text-lg font-medium text-white">
              {currentPhase?.text}
            </div>
            <p className="text-sm text-white/80 mt-2">
              {selectedExercise.description}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleStartPause}
          className={`flex items-center gap-2 px-6 py-3 rounded-full ${
            isActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          } transition-colors`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-blue-800 mb-2">How to practice:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Find a comfortable position</li>
          <li>• Close your eyes if comfortable</li>
          <li>• Follow the breathing pattern</li>
          <li>• Focus on your breath</li>
          <li>• Practice for 5-10 minutes</li>
        </ul>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-stone-50 p-3 rounded-lg text-center">
          <div className="text-lg">😌</div>
          <div className="text-stone-700">Reduces stress</div>
        </div>
        <div className="bg-stone-50 p-3 rounded-lg text-center">
          <div className="text-lg">🎯</div>
          <div className="text-stone-700">Improves focus</div>
        </div>
        <div className="bg-stone-50 p-3 rounded-lg text-center">
          <div className="text-lg">💤</div>
          <div className="text-stone-700">Better sleep</div>
        </div>
        <div className="bg-stone-50 p-3 rounded-lg text-center">
          <div className="text-lg">❤️</div>
          <div className="text-stone-700">Calms mind</div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;