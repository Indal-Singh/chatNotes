import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatNotes from './NotesInterFace';
import Login from './Login';
import Signup from './Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<ChatNotes />} />
      </Routes>
    </Router>
  );
};

export default App;
