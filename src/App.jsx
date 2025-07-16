// import React, { useState, useEffect } from 'react';
// Import routing components from react-router-dom
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestGame from './TestGame/TestGame';
import HomePage from './HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          {/* The Routes component defines where your pages will render */}
          <Routes>
            {/* Each Route maps a URL path to a component */}
            <Route path="/clicker" element={<TestGame />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;