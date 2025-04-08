# CS5610 Web Development - Project Repository

## Overview
This repository contains projects for the CS5610 Web Development course. The current implementation focuses on Project 2, which builds upon Project 1 by transforming a static Battleship game website into an interactive React application. It is now deployed on render, please visit：https://mengqiu-battleship.onrender.com

## Project 2: Interactive Battleship Game
Project 2 enhances the static Battleship website from Project 1 by implementing interactive gameplay using React. The application now features:

Complete transformation from static HTML/CSS to a React-based application <br>
Implementation of game logic for single-player Battleship against an AI opponent <br>
Two game modes: Normal Mode and Free Play Mode <br>
Custom ship placement feature allowing players to position their ships manually <br>
Game state management using React Context API <br>
Persistent game state using localStorage <br>
Responsive design for both desktop and mobile devices <br>

## Game Features
10x10 game boards for both player and AI
Player-controlled ship placement option
Random ship placement option
Turn-based gameplay (player vs AI)
Game timer to track gameplay duration
Game status display and reset functionality

## Technical Implementation
React components for modular UI construction<br>
React Router for page navigation<br>
Context API for state management<br>
Local storage for game state persistence<br>
CSS styling preserved from Project 1 with enhancements for interactivity<br>

## Folder Structure
```bash
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
```

## Author
Mengqiu Liu<br>
Email: liumengqiu23@gmail.com<br>
GitHub: github.com/EffieLiu-OvO<br>
