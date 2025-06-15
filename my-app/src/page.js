import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import rawRules from './data/rules.json';
import './page.css';

/**
 * Flatten rules.json so every "key : value" pair is its own segment.
 */
const flattenRules = (rules) => {
  const segments = [];
  rules.forEach((rule) => {
    if (typeof rule.text === 'string') {
      segments.push({ id: rule.id, title: rule.title, text: rule.text.trim() });
      return;
    }
    if (rule.text && typeof rule.text === 'object') {
      Object.entries(rule.text).forEach(([key, val]) => {
        if (!val) return;
        segments.push({ id: `${rule.id}-${key}`, title: `${rule.title} (${key})`, text: val.trim() });
      });
    }
  });
  return segments.filter((s) => s.text.length);
};

const MidlandsTypingPractice = () => {
  /** ------------- memoised data ------------- */
  const allSegments = useMemo(() => flattenRules(rawRules), []);

  /** ------------- state ------------- */
  const [currentSegment, setCurrentSegment] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showStats, setShowStats] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [typedCharsTotal, setTypedCharsTotal] = useState(0); // NEW ➜ cumulative char count

  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  /** ------------- helpers ------------- */
  const pickRandomSegment = useCallback(() => allSegments[Math.floor(Math.random() * allSegments.length)], [allSegments]);

  /**
   * Replace the current segment with a fresh one – but first add the chars the
   * user just typed to the running total so WPM remains cumulative.
   */
  const generateNewSegment = () => {
    setTypedCharsTotal((prev) => prev + userInput.length); // accumulate
    setUserInput('');
    setErrors(0);
    setAccuracy(100);
    setCurrentSegment(pickRandomSegment());
    // ❌ Never reset wpm here – it's derived from totals
  };

  /** ------------- test lifecycle ------------- */
  const startTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const now = Date.now();
    setCurrentSegment(pickRandomSegment());
    setUserInput('');
    setIsActive(true);
    setStartTime(now);
    setTimeRemaining(timeLimit);
    setShowStats(false);
    setAccuracy(100);
    setErrors(0);
    setTypedCharsTotal(0); // reset totals at test start

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

    inputRef.current?.focus();
  };

  const endTest = () => {
    // final chars in current input box also count toward totals
    setTypedCharsTotal((prev) => prev + userInput.length);
    setIsActive(false);
    setShowStats(true);
    clearInterval(intervalRef.current);
  };

  /** ------------- typing / metrics ------------- */
  useEffect(() => {
    if (!isActive || !startTime) return;

    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const totalChars = typedCharsTotal + userInput.length; // include live chars
    const wordsTyped = totalChars / 5;
    setWpm(Math.max(0, Math.round(wordsTyped / Math.max(elapsedMinutes, 0.01))));

    // segment‑specific accuracy / replacement
    if (currentSegment) {
      const correctChars = [...userInput].filter((ch, i) => ch === currentSegment.text[i]).length;
      setAccuracy(Math.round((correctChars / (userInput.length || 1)) * 100));

      if (userInput.length >= currentSegment.text.length && timeRemaining > 0) {
        generateNewSegment();
      }
    }
  }, [userInput, startTime, currentSegment, isActive, typedCharsTotal, timeRemaining]);

  /** ------------- handlers ------------- */
  const handleInputChange = (e) => {
    if (!isActive) return;
    const value = e.target.value;
    setUserInput(value);

    let errorCount = 0;
    for (let i = 0; i < value.length; i++) if (value[i] !== currentSegment.text[i]) errorCount++;
    setErrors(errorCount);
  };

  const getCharClass = (index) => {
    if (index < userInput.length) return userInput[index] === currentSegment.text[index] ? 'correct' : 'incorrect';
    if (index === userInput.length) return 'current';
    return 'pending';
  };

  /** ------------- render ------------- */
  return (
    <div className="container">
      <h1 className="heading">Midlands Rules Typing Practice</h1>
      <p className="subheading">Master your typing speed while memorizing evidence law</p>

      {/* controls */}
      <div className="controls gap-6">
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-400 mb-1">Time Limit</label>
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
          <label className="text-sm text-gray-400 mb-1">Action</label>
          <button
            onClick={startTest}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {isActive ? 'Restart' : 'Start Test'}
          </button>
        </div>
      </div>

      {/* stats */}
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

      {/* typing area */}
      {currentSegment && (
        <div className="typing-area">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">{currentSegment.title}</h2>
          {currentSegment.text.split('').map((char, index) => (
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

      {/* results */}
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
