// src/App.js
import React from 'react';
import JigsawPuzzle from './components/JigsawPuzzle';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Jigsaw Puzzle Game</h1>
        <JigsawPuzzle />
      </div>
    </div>
  );
}

export default App;