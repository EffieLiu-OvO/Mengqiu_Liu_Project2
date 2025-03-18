import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Battleship</div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/game"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Game
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rules"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Rules
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/scores"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Scores
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
