import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import RulesPage from "./pages/RulesPage";
import ScoresPage from "./pages/ScoresPage";
import ShipPlacementPage from "./pages/ShipPlacementPage";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:mode" element={<GamePage />} />
            <Route path="/game" element={<GamePage mode="normal" />} />
            <Route path="/placement" element={<ShipPlacementPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/scores" element={<ScoresPage />} />
          </Routes>
          <Footer />
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;
