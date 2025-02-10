import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const JigsawPuzzle = () => {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gridSize, setGridSize] = useState(3); // 3x3 puzzle by default
  const canvasRef = useRef(null);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          createPuzzlePieces(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Create puzzle pieces
  const createPuzzlePieces = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = 400;  // Fixed size for consistency
    canvas.height = 400;
    
    // Draw and scale image to fit canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const pieceWidth = canvas.width / gridSize;
    const pieceHeight = canvas.height / gridSize;
    const newPieces = [];
    
    // Create pieces
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceWidth;
        pieceCanvas.height = pieceHeight;
        const pieceCtx = pieceCanvas.getContext('2d');
        
        pieceCtx.drawImage(
          canvas, 
          x * pieceWidth, y * pieceHeight, 
          pieceWidth, pieceHeight,
          0, 0, pieceWidth, pieceHeight
        );
        
        newPieces.push({
          id: y * gridSize + x,
          img: pieceCanvas.toDataURL(),
          correctX: x,
          correctY: y,
          currentX: x,
          currentY: y
        });
      }
    }
    
    // Shuffle pieces
    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach((piece, index) => {
      piece.currentX = index % gridSize;
      piece.currentY = Math.floor(index / gridSize);
    });
    
    setPieces(shuffledPieces);
    setGameStarted(true);
  };

  // Handle piece dragging
  const handleDragStart = (piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (targetX, targetY) => {
    if (!draggedPiece) return;

    const newPieces = [...pieces];
    const draggedIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    const targetIndex = pieces.findIndex(p => p.currentX === targetX && p.currentY === targetY);

    // Swap positions
    const tempX = newPieces[draggedIndex].currentX;
    const tempY = newPieces[draggedIndex].currentY;
    newPieces[draggedIndex].currentX = targetX;
    newPieces[draggedIndex].currentY = targetY;
    newPieces[targetIndex].currentX = tempX;
    newPieces[targetIndex].currentY = tempY;

    setPieces(newPieces);
    setDraggedPiece(null);

    // Check if puzzle is solved
    const isSolved = newPieces.every(piece => 
      piece.currentX === piece.correctX && piece.currentY === piece.correctY
    );
    setSolved(isSolved);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {!gameStarted && (
        <div className="flex flex-col items-center gap-4">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <Upload className="w-8 h-8" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <div className="flex items-center gap-2">
            <span>Grid Size:</span>
            <select 
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="border p-1 rounded"
            >
              <option value="2">2x2</option>
              <option value="3">3x3</option>
              <option value="4">4x4</option>
              <option value="5">5x5</option>
            </select>
          </div>
        </div>
      )}

      {gameStarted && (
        <div 
          className="grid gap-1 bg-gray-200 p-2 rounded"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const piece = pieces.find(p => p.currentX === x && p.currentY === y);
            
            return (
              <div
                key={index}
                className="w-24 h-24 border bg-white cursor-move"
                draggable
                onDragStart={() => handleDragStart(piece)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(x, y)}
              >
                {piece && (
                  <img
                    src={piece.img}
                    alt={`Piece ${piece.id}`}
                    className="w-full h-full"
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {solved && (
        <div className="text-green-600 font-bold text-xl">
          Congratulations! Puzzle Solved! 🎉
        </div>
      )}

      {gameStarted && (
        <button
          onClick={() => {
            setGameStarted(false);
            setPieces([]);
            setSolved(false);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default JigsawPuzzle;