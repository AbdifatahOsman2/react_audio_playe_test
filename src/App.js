import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SurahList from './screens/SurahList.js';
import AudioPlayer from './screens/Player.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/surah/:surahIndex" element={<AudioPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;
