import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MidlandsTypingPractice from './page'; // or wherever the file lives

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MidlandsTypingPractice />} />
      </Routes>
    </Router>
  );
}

export default App;
