import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Elections from './components/Elections'
import Bitcoin from './components/Bitcoin'
import SuperPowerIndex from './components/SuperPowerIndex'

// Dummy components for routing
const Home = () => <div><h2>Home Page</h2></div>;

const App = () => {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/crypto" element={<Bitcoin />} />
          <Route path="/superPowerIndex" element={<SuperPowerIndex />} />
          <Route path="/" element={<Home />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
