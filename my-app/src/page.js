import React, { useState, useEffect, useCallback, useRef } from 'react';
import rules from './data/rules.json';
import './page.css';

const MidlandsTypingPractice = () => {
  const [currentRule, setCurrentRule] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showStats, setShowStats] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const pickRandomRule = useCallback(() => {
    const rule = rules[Math.floor(Math.random() * rules.length)];
    const text = typeof rule.text === 'string' ? rule.text : Object.entries(rule.text).map(([key, val]) => `${key}) ${val}`).join(' ');
    return { ...rule, text };
  }, []);

  const generateNewRule = () => {
    const rule = pickRandomRule();
    setCurrentRule(rule);
    setUserInput('');
    setErrors(0);
    setAccuracy(100);
    setWpm(0);
  };

  const startTest = () => {
    const rule = pickRandomRule();
    const now = Date.now();
    setCurrentRule(rule);
    setUserInput('');
    setIsActive(true);
    setStartTime(now);
    setTimeRemaining(timeLimit);
    setShowStats(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - now) / 1000);
      const remaining = timeLimit - elapsed;
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setTimeRemaining(0);
        endTest();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);
  };

  const endTest = () => {
    setIsActive(false);
    setShowStats(true);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isActive || !startTime || !currentRule) return;
    const elapsed = (Date.now() - startTime) / 60000;
    const wordsTyped = userInput.length / 5;
    setWpm(Math.round(wordsTyped / elapsed));
    const correct = [...userInput].filter((char, i) => char === currentRule.text[i]).length;
    setAccuracy(Math.round((correct / (userInput.length || 1)) * 100));

    if (userInput === currentRule.text && timeRemaining > 0) {
      generateNewRule();
    } else if (
      userInput.length >= currentRule.text.length - 5 &&
      userInput !== currentRule.text &&
      timeRemaining <= 10
    ) {
      setTimeLimit((prev) => prev + 60);
      setTimeRemaining((prev) => prev + 60);
    }
  }, [userInput, startTime, currentRule, isActive, timeRemaining]);

  const handleInputChange = (e) => {
    if (!isActive) return;
    const value = e.target.value;
    setUserInput(value);
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentRule.text[i]) errorCount++;
    }
    setErrors(errorCount);
  };

  const getCharClass = (index) => {
    if (index < userInput.length) {
      return userInput[index] === currentRule.text[index] ? 'correct' : 'incorrect';
    } else if (index === userInput.length) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getProngs = (text) => {
    const matches = text.match(/\([a-e]\)/gi);
    return matches ? matches.join(', ') : null;
  };

  return (
    <div className="container">
      <h1 className="heading">Midlands Rules Typing Practice</h1>
      <p className="subheading">Master your typing speed while memorizing evidence law</p>

      <div className="controls gap-6">
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-400 mb-1">Time Limit    </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-400 mb-1">Action    </label>
          <button
            onClick={startTest}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Start Test
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{wpm}</div>
          <div className="stat-label">WPM</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{timeRemaining}s</div>
          <div className="stat-label">Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{errors}</div>
          <div className="stat-label">Errors</div>
        </div>
      </div>

      {currentRule && (
        <div className="typing-area">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">{currentRule.title}</h2>
          <p className="text-sm text-gray-400 mb-2">Prongs: {getProngs(currentRule.text) || 'None'}</p>
          {currentRule.text.split('').map((char, index) => (
            <span key={index} className={getCharClass(index)}>
              {char}
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        ref={inputRef}
        value={userInput}
        onChange={handleInputChange}
        className="typing-input"
        placeholder="Start typing here..."
        disabled={!isActive}
      />

      {showStats && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h2 className="text-2xl font-bold mb-2">Results</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Errors: {errors}</p>
        </div>
      )}
    </div>
  );
};

export default MidlandsTypingPractice;
