import React, { useEffect, useRef } from 'react';
import { useTetris } from './hooks/useTetris';
import { Board } from './components/Board';
import { NextPiece } from './components/NextPiece';
import { Controls } from './components/Controls';
import { GameStatus } from './constants';

export default function App() {
  const {
    grid,
    activePiece,
    score,
    status,
    nextPieceId,
    startGame,
    pauseGame,
    move,
    rotate,
    drop,
    hardDrop
  } = useTetris();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== GameStatus.PLAYING && e.code !== 'Space' && e.code !== 'KeyP') return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'ArrowLeft':
          move(-1);
          break;
        case 'ArrowRight':
          move(1);
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case 'Space':
          if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) {
             startGame();
          } else {
             hardDrop();
          }
          break;
        case 'KeyP':
          pauseGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, move, rotate, drop, hardDrop, pauseGame, startGame]);

  // Focus management
  const appRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={appRef}
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-8 px-4 font-mono outline-none"
      tabIndex={0}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600 drop-shadow-lg italic transform -skew-x-12">
          HEAVY TETRIS
        </h1>
        <p className="text-gray-400 text-sm mt-2">Use Arrows to move/rotate, Space to drop</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start w-full justify-center">
        
        {/* Left Stats Panel (Desktop) */}
        <div className="hidden md:flex flex-col gap-4 w-40 sticky top-4">
           <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg text-center">
             <h3 className="text-gray-400 text-xs font-bold uppercase mb-1">Score</h3>
             <span className="text-3xl font-mono text-white">{score}</span>
           </div>
           <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg text-center">
             <h3 className="text-gray-400 text-xs font-bold uppercase mb-1">Status</h3>
             <span className={`text-sm font-bold ${status === GameStatus.PLAYING ? 'text-green-400' : 'text-yellow-400'}`}>
               {status}
             </span>
           </div>
           <button 
             onClick={status === GameStatus.PLAYING ? pauseGame : startGame}
             className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg transition active:scale-95"
           >
             {status === GameStatus.PLAYING ? 'PAUSE' : status === GameStatus.IDLE ? 'START' : 'RESTART'}
           </button>
        </div>

        {/* Game Board Area */}
        {/* 
            Board Aspect Ratio: 18 / 26 ~= 0.69
            To fit in ~80vh height on desktop, width should be approx 55vh.
        */}
        <div className="relative group w-full md:max-w-[55vh]">
          <Board grid={grid} activePiece={activePiece} />

          {/* Overlays */}
          {status === GameStatus.IDLE && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-20 backdrop-blur-sm">
              <button 
                onClick={startGame}
                className="bg-white text-black px-8 py-4 text-xl font-bold rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse"
              >
                START GAME
              </button>
            </div>
          )}

          {status === GameStatus.GAME_OVER && (
            <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center rounded-lg z-20 backdrop-blur-sm">
              <h2 className="text-4xl font-black text-white mb-2">GAME OVER</h2>
              <p className="text-xl text-red-200 mb-6">Final Score: {score}</p>
              <button 
                onClick={startGame}
                className="bg-white text-red-900 px-8 py-3 font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
              >
                TRY AGAIN
              </button>
            </div>
          )}
          
           {status === GameStatus.PAUSED && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-20 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white tracking-widest">PAUSED</h2>
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="flex flex-col gap-4 w-full md:w-40">
           {/* Mobile Score Strip */}
           <div className="md:hidden flex justify-between bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div>
                 <div className="text-xs text-gray-400 uppercase">Score</div>
                 <div className="text-xl font-bold">{score}</div>
              </div>
              <div className="text-right">
                  <button onClick={status === GameStatus.PLAYING ? pauseGame : startGame} className="text-indigo-400 font-bold text-sm uppercase">
                    {status === GameStatus.PLAYING ? 'Pause' : 'Start'}
                  </button>
              </div>
           </div>

           <NextPiece shapeId={nextPieceId} />
           
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden w-full flex justify-center pb-8">
        <Controls 
          onLeft={() => move(-1)}
          onRight={() => move(1)}
          onDown={drop}
          onRotate={rotate}
          onDrop={hardDrop}
        />
      </div>
    </div>
  );
}