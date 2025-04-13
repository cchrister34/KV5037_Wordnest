
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wordnest from "./pages/Wordnest.jsx";
import NotFound from "./pages/NotFound";
import './index.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wordnest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
