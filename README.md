# CS5610 Web Development - Project Repository

## Overview
This repository contains projects for the CS5610 Web Development course. The current implementation focuses on Project 2, which builds upon Project 1 by transforming a static Battleship game website into an interactive React application.

## Project 2: Interactive Battleship Game
Project 2 enhances the static Battleship website from Project 1 by implementing interactive gameplay using React. The application now features:

Complete transformation from static HTML/CSS to a React-based application
Implementation of game logic for single-player Battleship against an AI opponent
Two game modes: Normal Mode and Free Play Mode
Custom ship placement feature allowing players to position their ships manually
Game state management using React Context API
Persistent game state using localStorage
Responsive design for both desktop and mobile devices

## Game Features
10x10 game boards for both player and AI
Player-controlled ship placement option
Random ship placement option
Turn-based gameplay (player vs AI)
Game timer to track gameplay duration
Game status display and reset functionality

## Technical Implementation
React components for modular UI construction
React Router for page navigation
Context API for state management
Local storage for game state persistence
CSS styling preserved from Project 1 with enhancements for interactivity

## Folder Structure
'''bash
p2-battleship-react/
├── public/
│   ├── index.html
│   └── battleship.jpg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Cell.js
│   │   ├── Footer.js
│   │   ├── GameBoard.js
│   │   ├── GameControls.js
│   │   ├── NavBar.js
│   │   └── ShipPlacementBoard.js
│   ├── context/
│   │   └── GameContext.js
│   ├── pages/
│   │   ├── GamePage.js
│   │   ├── HomePage.js
│   │   ├── ResultsPage.js
│   │   ├── RulesPage.js
│   │   ├── ScoresPage.js
│   │   └── ShipPlacementPage.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── Game.css
│   │   ├── Home.css
│   │   ├── index.css
│   │   ├── Rules.css
│   │   ├── Scores.css
│   │   └── ShipPlacement.css
│   ├── utils/
│   │   └── shipPlacement.js
│   ├── App.js
│   └── index.js
└── README.md
'''

## Author
Mengqiu Liu
Email: liumengqiu23@gmail.com
GitHub: github.com/EffieLiu-OvO
