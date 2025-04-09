import { useState, useEffect, useRef } from 'react';

export default function HadriansCrossword() {
  const [page, setPage] = useState('home');
  const [difficulty, setDifficulty] = useState('medium');
  const [theme, setTheme] = useState('light');
  const [sound, setSound] = useState(true);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [userAnswers, setUserAnswers] = useState({});
  const [correctWords, setCorrectWords] = useState([]);
  const [complete, setComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  const gameContainerRef = useRef(null);

  // Properly structured crossword puzzles
  const puzzles = {
    easy: {
      // Using blank spaces for empty cells and letters for the answer template
      grid: [
        [' ', ' ', ' ', 'B', ' ', ' ', ' '],
        ['A', 'L', 'N', 'W', 'I', 'C', 'K'],
        [' ', ' ', ' ', 'M', ' ', ' ', ' '],
        ['T', 'Y', 'N', 'E', ' ', ' ', ' '],
        [' ', ' ', ' ', 'U', ' ', ' ', ' '],
        [' ', 'D', 'U', 'R', 'H', 'A', 'M'],
        [' ', ' ', ' ', 'G', ' ', ' ', ' '],
        [' ', ' ', ' ', 'H', ' ', ' ', ' ']
      ],
      cellNumbers: {
        '0-3': 1,
        '1-0': 2,
        '3-0': 3,
        '5-1': 4
      },
      clues: {
        across: {
          2: { num: 2, clue: "Castle town and county seat of Northumberland", answer: "ALNWICK", row: 1, col: 0 },
          3: { num: 3, clue: "River flowing through Newcastle", answer: "TYNE", row: 3, col: 0 },
          4: { num: 4, clue: "Cathedral city in County Durham", answer: "DURHAM", row: 5, col: 1 }
        },
        down: {
          1: { num: 1, clue: "Historic castle on the Northumberland coast", answer: "BAMBURGH", row: 0, col: 3 }
        }
      }
    },
    medium: {
      grid: [
        [' ', ' ', ' ', ' ', ' ', 'N', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'E', ' ', ' '],
        ['G', 'A', 'T', 'E', 'S', 'H', 'E', 'A', 'D'],
        [' ', ' ', ' ', ' ', ' ', 'C', ' ', ' '],
        [' ', ' ', 'S', 'H', 'E', 'A', 'R', 'E', 'R'],
        [' ', ' ', ' ', ' ', ' ', 'S', ' ', ' '],
        [' ', ' ', ' ', 'S', 'U', 'N', 'D', 'E', 'R', 'L', 'A', 'N', 'D'],
        [' ', ' ', ' ', ' ', ' ', 'L', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'E', ' ', ' ']
      ],
      cellNumbers: {
        '0-5': 1,
        '2-0': 2,
        '4-2': 3,
        '6-3': 4
      },
      clues: {
        across: {
          2: { num: 2, clue: "Town connected to Newcastle by seven bridges", answer: "GATESHEAD", row: 2, col: 0 },
          3: { num: 3, clue: "Newcastle United's legendary striker Alan", answer: "SHEARER", row: 4, col: 2 },
          4: { num: 4, clue: "City known for its automotive industry", answer: "SUNDERLAND", row: 6, col: 3 }
        },
        down: {
          1: { num: 1, clue: "Historic structure built by Romans in 122 AD", answer: "NEWCASTLE", row: 0, col: 5 }
        }
      }
    },
    hard: {
      grid: [
        [' ', ' ', ' ', ' ', ' ', ' ', 'A', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'N', ' ', ' '],
        ['H', 'A', 'D', 'R', 'I', 'A', 'N', 'S', 'W', 'A', 'L', 'L'],
        [' ', ' ', ' ', ' ', ' ', ' ', 'G', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'E', ' ', ' '],
        [' ', ' ', 'B', 'A', 'M', 'B', 'U', 'R', 'G', 'H'],
        [' ', ' ', ' ', ' ', ' ', ' ', 'F', ' ', ' '],
        ['T', 'Y', 'N', 'E', 'M', 'O', 'U', 'T', 'H'],
        [' ', ' ', ' ', ' ', ' ', ' ', 'R', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'T', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', 'H', ' ', ' ']
      ],
      cellNumbers: {
        '0-6': 1,
        '2-0': 2,
        '5-2': 3,
        '7-0': 4
      },
      clues: {
        across: {
          2: { num: 2, clue: "Historic landmark built by Romans", answer: "HADRIANSWALL", row: 2, col: 0 },
          3: { num: 3, clue: "Historic castle with stunning coastal views", answer: "BAMBURGH", row: 5, col: 2 },
          4: { num: 4, clue: "Coastal town where the Tyne meets the sea", answer: "TYNEMOUTH", row: 7, col: 0 }
        },
        down: {
          1: { num: 1, clue: "Angel of the ___, famous Gateshead sculpture", answer: "ANGELFURTH", row: 0, col: 6 }
        }
      }
    }
  };

  // Set up focus and timer
  useEffect(() => {
    // Focus the game container when game starts
    if (page === 'game' && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    
    // Set up timer
    if (page === 'game' && currentPuzzle && timerRunning) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [page, currentPuzzle, timerRunning]);

  // Initialize the game with proper focus handling
  const startGame = () => {
    const puzzle = puzzles[difficulty];
    setCurrentPuzzle(puzzle);
    
    // Initialize user answers with empty grid
    const initialAnswers = {};
    for (let r = 0; r < puzzle.grid.length; r++) {
      for (let c = 0; c < puzzle.grid[r].length; c++) {
        if (puzzle.grid[r][c] !== ' ') {
          initialAnswers[`${r}-${c}`] = '';
        }
      }
    }
    
    setUserAnswers(initialAnswers);
    setCorrectWords([]);
    setComplete(false);
    setTimer(0);
    setTimerRunning(true);
    setPage('game');
    
    // Find first fillable cell to select automatically
    setTimeout(() => {
      if (puzzle) {
        // Try to find first across clue's starting cell
        const firstAcrossClue = Object.values(puzzle.clues.across)[0];
        if (firstAcrossClue) {
          setSelectedCell({ row: firstAcrossClue.row, col: firstAcrossClue.col });
          setDirection('across');
        } else {
          // Fallback to first down clue
          const firstDownClue = Object.values(puzzle.clues.down)[0];
          if (firstDownClue) {
            setSelectedCell({ row: firstDownClue.row, col: firstDownClue.col });
            setDirection('down');
          }
        }
        
        // Ensure focus
        if (gameContainerRef.current) {
          gameContainerRef.current.focus();
        }
      }
    }, 10);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (currentPuzzle.grid[rowIndex][colIndex] !== ' ') {
      if (selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex) {
        // Toggle direction when clicking the same cell
        setDirection(prev => prev === 'across' ? 'down' : 'across');
      } else {
        setSelectedCell({ row: rowIndex, col: colIndex });
        
        // Determine best direction based on available words
        const hasAcrossWord = checkIfCellHasAcrossWord(rowIndex, colIndex);
        const hasDownWord = checkIfCellHasDownWord(rowIndex, colIndex);
        
        if (hasAcrossWord && !hasDownWord) {
          setDirection('across');
        } else if (!hasAcrossWord && hasDownWord) {
          setDirection('down');
        }
        // If both or neither, keep current direction
      }
      
      // Refocus the game container
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
    }
  };

  // Helper functions to determine if cell is part of across/down word
  const checkIfCellHasAcrossWord = (row, col) => {
    if (!currentPuzzle) return false;
    
    // Check if part of any across clue
    for (const clue of Object.values(currentPuzzle.clues.across)) {
      if (row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) {
        return true;
      }
    }
    return false;
  };

  const checkIfCellHasDownWord = (row, col) => {
    if (!currentPuzzle) return false;
    
    // Check if part of any down clue
    for (const clue of Object.values(currentPuzzle.clues.down)) {
      if (col === clue.col && row >= clue.row && row < clue.row + clue.answer.length) {
        return true;
      }
    }
    return false;
  };

  const handleKeyPress = (e) => {
    if (!selectedCell || !currentPuzzle) return;
    
    // Handle letter input
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      // Update user answers
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      const newAnswers = { ...userAnswers, [cellKey]: key };
      setUserAnswers(newAnswers);
      
      // Check if any words are complete
      checkWordCompletion(newAnswers);
      
      // Move to next cell
      if (direction === 'across') {
        moveToNextCell(selectedCell.row, selectedCell.col + 1);
      } else {
        moveToNextCell(selectedCell.row + 1, selectedCell.col);
      }
      
      // Check if puzzle is complete
      checkPuzzleCompletion(newAnswers);
    } 
    // Handle backspace
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      const newAnswers = { ...userAnswers };
      
      if (newAnswers[cellKey] && newAnswers[cellKey] !== '') {
        // If current cell has content, clear it
        newAnswers[cellKey] = '';
        setUserAnswers(newAnswers);
      } else {
        // If current cell is empty, move to previous cell and clear it
        if (direction === 'across') {
          moveToNextCell(selectedCell.row, selectedCell.col - 1);
        } else {
          moveToNextCell(selectedCell.row - 1, selectedCell.col);
        }
        
        // Clear the cell we moved to
        setTimeout(() => {
          if (selectedCell) {
            const prevCellKey = `${selectedCell.row}-${selectedCell.col}`;
            if (newAnswers[prevCellKey]) {
              newAnswers[prevCellKey] = '';
              setUserAnswers(newAnswers);
            }
          }
        }, 10);
      }
    } 
    // Handle arrow keys
    else if (e.key === 'ArrowRight') {
      e.preventDefault(); // Prevent scrolling
      setDirection('across');
      moveToNextCell(selectedCell.row, selectedCell.col + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); // Prevent scrolling
      setDirection('across');
      moveToNextCell(selectedCell.row, selectedCell.col - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent scrolling
      setDirection('down');
      moveToNextCell(selectedCell.row + 1, selectedCell.col);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent scrolling
      setDirection('down');
      moveToNextCell(selectedCell.row - 1, selectedCell.col);
    } else if (e.key === 'Tab') {
      e.preventDefault(); // Prevent losing focus
      
      // Tab should move to next clue
      const clues = [
        ...Object.values(currentPuzzle.clues.across),
        ...Object.values(currentPuzzle.clues.down)
      ].sort((a, b) => a.num - b.num);
      
      // Find current clue
      let currentClueIndex = -1;
      if (direction === 'across') {
        const currentClue = Object.values(currentPuzzle.clues.across).find(
          clue => selectedCell.row === clue.row && selectedCell.col >= clue.col && selectedCell.col < clue.col + clue.answer.length
        );
        if (currentClue) {
          currentClueIndex = clues.findIndex(c => c.num === currentClue.num && c === currentClue);
        }
      } else {
        const currentClue = Object.values(currentPuzzle.clues.down).find(
          clue => selectedCell.col === clue.col && selectedCell.row >= clue.row && selectedCell.row < clue.row + clue.answer.length
        );
        if (currentClue) {
          currentClueIndex = clues.findIndex(c => c.num === currentClue.num && c === currentClue);
        }
      }
      
      // Move to next clue
      if (currentClueIndex !== -1) {
        const nextClueIndex = (currentClueIndex + 1) % clues.length;
        const nextClue = clues[nextClueIndex];
        
        setSelectedCell({ row: nextClue.row, col: nextClue.col });
        setDirection(
          Object.values(currentPuzzle.clues.across).includes(nextClue) ? 'across' : 'down'
        );
      }
    }
  };

  const moveToNextCell = (row, col) => {
    if (!currentPuzzle) return;
    
    // Check if next cell is valid
    if (row >= 0 && row < currentPuzzle.grid.length && 
        col >= 0 && col < currentPuzzle.grid[row].length) {
      if (currentPuzzle.grid[row][col] !== ' ') {
        setSelectedCell({ row, col });
      } else {
        // Skip empty cells in the direction of movement
        if (direction === 'across') {
          const nextCol = col > selectedCell.col ? col + 1 : col - 1;
          moveToNextCell(row, nextCol);
        } else {
          const nextRow = row > selectedCell.row ? row + 1 : row - 1;
          moveToNextCell(nextRow, col);
        }
      }
    } else {
      // If we've gone off the grid, wrap around to the next/previous word
      if (direction === 'across') {
        // Find all words in the current row
        let acrossWords = Object.values(currentPuzzle.clues.across).filter(
          clue => clue.row === selectedCell.row
        );
        
        if (acrossWords.length > 0) {
          // Sort words by column
          acrossWords.sort((a, b) => a.col - b.col);
          
          // Find the current word
          const currentWord = acrossWords.find(
            word => selectedCell.col >= word.col && selectedCell.col < word.col + word.answer.length
          );
          
          if (currentWord) {
            const currentIndex = acrossWords.indexOf(currentWord);
            
            if (col > selectedCell.col) {
              // Moving right, go to next word or wrap to first
              const nextIndex = (currentIndex + 1) % acrossWords.length;
              const nextWord = acrossWords[nextIndex];
              setSelectedCell({ row: nextWord.row, col: nextWord.col });
            } else {
              // Moving left, go to previous word or wrap to last
              const prevIndex = (currentIndex - 1 + acrossWords.length) % acrossWords.length;
              const prevWord = acrossWords[prevIndex];
              setSelectedCell({ row: prevWord.row, col: prevWord.col + prevWord.answer.length - 1 });
            }
          }
        }
      } else {
        // Find all words in the current column
        let downWords = Object.values(currentPuzzle.clues.down).filter(
          clue => clue.col === selectedCell.col
        );
        
        if (downWords.length > 0) {
          // Sort words by row
          downWords.sort((a, b) => a.row - b.row);
          
          // Find the current word
          const currentWord = downWords.find(
            word => selectedCell.row >= word.row && selectedCell.row < word.row + word.answer.length
          );
          
          if (currentWord) {
            const currentIndex = downWords.indexOf(currentWord);
            
            if (row > selectedCell.row) {
              // Moving down, go to next word or wrap to first
              const nextIndex = (currentIndex + 1) % downWords.length;
              const nextWord = downWords[nextIndex];
              setSelectedCell({ row: nextWord.row, col: nextWord.col });
            } else {
              // Moving up, go to previous word or wrap to last
              const prevIndex = (currentIndex - 1 + downWords.length) % downWords.length;
              const prevWord = downWords[prevIndex];
              setSelectedCell({ row: prevWord.row + prevWord.answer.length - 1, col: prevWord.col });
            }
          }
        }
      }
    }
  };

  const checkWordCompletion = (answers) => {
    const newCorrectWords = [...correctWords];
    
    // Check across words
    Object.values(currentPuzzle.clues.across).forEach(clue => {
      const { row, col, answer, num } = clue;
      let isComplete = true;
      let userAnswer = '';
      
      for (let i = 0; i < answer.length; i++) {
        const cellKey = `${row}-${col + i}`;
        if (!answers[cellKey] || answers[cellKey] === '') {
          isComplete = false;
          break;
        }
        userAnswer += answers[cellKey];
      }
      
      const wordKey = `across-${num}`;
      
      if (isComplete) {
        if (userAnswer === answer && !newCorrectWords.includes(wordKey)) {
          newCorrectWords.push(wordKey);
        } else if (userAnswer !== answer && newCorrectWords.includes(wordKey)) {
          const index = newCorrectWords.indexOf(wordKey);
          if (index > -1) {
            newCorrectWords.splice(index, 1);
          }
        }
      }
    });
    
    // Check down words
    Object.values(currentPuzzle.clues.down).forEach(clue => {
      const { row, col, answer, num } = clue;
      let isComplete = true;
      let userAnswer = '';
      
      for (let i = 0; i < answer.length; i++) {
        const cellKey = `${row + i}-${col}`;
        if (!answers[cellKey] || answers[cellKey] === '') {
          isComplete = false;
          break;
        }
        userAnswer += answers[cellKey];
      }
      
      const wordKey = `down-${num}`;
      
      if (isComplete) {
        if (userAnswer === answer && !newCorrectWords.includes(wordKey)) {
          newCorrectWords.push(wordKey);
        } else if (userAnswer !== answer && newCorrectWords.includes(wordKey)) {
          const index = newCorrectWords.indexOf(wordKey);
          if (index > -1) {
            newCorrectWords.splice(index, 1);
          }
        }
      }
    });
    
    if (JSON.stringify(newCorrectWords) !== JSON.stringify(correctWords)) {
      setCorrectWords(newCorrectWords);
    }
  };

  const checkPuzzleCompletion = (answers) => {
    if (!currentPuzzle) return;
    
    // Count total number of words
    const totalWords = Object.keys(currentPuzzle.clues.across).length + 
                       Object.keys(currentPuzzle.clues.down).length;
    
    // If all words are correct, puzzle is complete
    if (correctWords.length === totalWords) {
      setComplete(true);
      setTimerRunning(false);
      
      // Play completion sound if enabled
      if (sound) {
        try {
          // Create a simple success sound
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          
          // Play a short "success" melody
          setTimeout(() => {
            oscillator.frequency.value = 800;
          }, 150);
          
          setTimeout(() => {
            oscillator.frequency.value = 1000;
          }, 300);
          
          setTimeout(() => {
            oscillator.stop();
          }, 500);
        } catch (e) {
          // Fail silently if audio isn't supported
          console.log('Audio not supported');
        }
      }
    }
  };

  const isCellInCorrectWord = (rowIndex, colIndex) => {
    if (!currentPuzzle || !correctWords.length) return false;
    
    let inCorrectWord = false;
    
    // Check if cell is part of a correct across word
    Object.values(currentPuzzle.clues.across).forEach(clue => {
      const { row, col, answer, num } = clue;
      const wordKey = `across-${num}`;
      
      if (correctWords.includes(wordKey) && 
          rowIndex === row && 
          colIndex >= col && 
          colIndex < col + answer.length) {
        inCorrectWord = true;
      }
    });
    
    // Check if cell is part of a correct down word
    Object.values(currentPuzzle.clues.down).forEach(clue => {
      const { row, col, answer, num } = clue;
      const wordKey = `down-${num}`;
      
      if (correctWords.includes(wordKey) && 
          colIndex === col && 
          rowIndex >= row && 
          rowIndex < row + answer.length) {
        inCorrectWord = true;
      }
    });
    
    return inCorrectWord;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Render functions for each page
  const renderHomePage = () => (
    <div className={`flex flex-col h-screen items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-6">Hadrian's Crossword</h1>
      <p className="text-xl mb-8 text-center">Test your knowledge of North East England's monuments, towns, and football players!</p>
      
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <button 
          onClick={startGame} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transition duration-300"
        >
          Start Game
        </button>
        
        <button 
          onClick={() => setPage('settings')} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Settings
        </button>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm opacity-70">Explore the rich heritage of North East England</p>
        <p className="text-sm opacity-70">From Hadrian's Wall to the River Tyne</p>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'}`}>
      <div className="p-4 border-b">
        <button onClick={() => setPage('home')} className="flex items-center">
          <span className="text-2xl mr-2">←</span> Back
        </button>
      </div>
      
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Difficulty</h2>
            <div className="flex flex-col space-y-2">
              {['easy', 'medium', 'hard'].map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={difficulty === level}
                    onChange={() => setDifficulty(level)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Theme</h2>
            <div className="flex flex-col space-y-2">
              {['light', 'dark'].map(themeOption => (
                <label key={themeOption} className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={theme === themeOption}
                    onChange={() => setTheme(themeOption)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="capitalize">{themeOption}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Sound</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sound}
                onChange={() => setSound(!sound)}
                className="mr-2 h-5 w-5"
              />
              <span>Enable sound effects</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGamePage = () => {
    if (!currentPuzzle) return null;
    
    return (
      <div 
        className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'}`}
        onKeyDown={handleKeyPress}
        tabIndex="0"
        ref={gameContainerRef}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <button 
            onClick={() => {
              setPage('home');
              setTimerRunning(false);
            }} 
            className="flex items-center"
          >
            <span className="text-2xl mr-2">←</span> Home
          </button>
          <div className="font-mono text-lg">{formatTime(timer)}</div>
        </div>
        
        {complete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">You completed the crossword in {formatTime(timer)}</p>
            <button 
              onClick={() => setPage('home')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col md:flex-row md:space
            <div className="flex flex-col md:flex-row md:space-x-4">
              {/* Crossword Grid */}
              <div className="w-full md:w-3/5 overflow-auto">
                <div className="grid grid-flow-row auto-rows-fr gap-0 mx-auto" style={{ maxWidth: '95vw' }}>
                  {currentPuzzle.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((cell, colIndex) => {
                        const cellKey = `${rowIndex}-${colIndex}`;
                        const cellNumber = currentPuzzle.cellNumbers[cellKey];
                        const isCorrect = cell !== ' ' && isCellInCorrectWord(rowIndex, colIndex);
                        const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
                        const isHighlighted = !isCorrect && selectedCell && (
                          (direction === 'across' && selectedCell.row === rowIndex && checkIfCellHasAcrossWord(rowIndex, colIndex)) ||
                          (direction === 'down' && selectedCell.col === colIndex && checkIfCellHasDownWord(rowIndex, colIndex))
                        );
                        
                        return (
                          <div 
                            key={cellKey}
                            className={`
                              relative border border-gray-400 flex items-center justify-center
                              ${cell === ' ' ? 'bg-gray-900' : theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-black'}
                              ${isCorrect ? 'bg-green-200 text-black' : ''}
                              ${isSelected ? 'bg-blue-200 text-black' : ''}
                              ${isHighlighted ? 'bg-blue-100 text-black' : ''}
                            `}
                            style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem', minHeight: '2.5rem' }}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                          >
                            {cellNumber && (
                              <span className="absolute top-0 left-0 text-xs font-semibold p-0.5">
                                {cellNumber}
                              </span>
                            )}
                            {cell !== ' ' && (
                              <span className="text-lg font-medium">
                                {userAnswers[cellKey] || ''}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Clues */}
              <div className="w-full md:w-2/5 mt-4 md:mt-0 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Across</h3>
                  <ul className="space-y-2">
                    {Object.values(currentPuzzle.clues.across).map(clue => {
                      const isCorrect = correctWords.includes(`across-${clue.num}`);
                      
                      return (
                        <li 
                          key={`across-${clue.num}`} 
                          className={`
                            text-sm cursor-pointer p-2 rounded
                            ${isCorrect ? 'text-green-600 font-semibold' : ''}
                            ${selectedCell && selectedCell.row === clue.row && 
                              selectedCell.col >= clue.col && 
                              selectedCell.col < clue.col + clue.answer.length && 
                              direction === 'across' ? 
                              'bg-blue-100 dark:bg-blue-900' : ''}
                          `}
                          onClick={() => {
                            setSelectedCell({ row: clue.row, col: clue.col });
                            setDirection('across');
                            // Refocus after clicking
                            if (gameContainerRef.current) {
                              gameContainerRef.current.focus();
                            }
                          }}
                        >
                          <span className="font-semibold">{clue.num}.</span> {clue.clue}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-2">Down</h3>
                  <ul className="space-y-2">
                    {Object.values(currentPuzzle.clues.down).map(clue => {
                      const isCorrect = correctWords.includes(`down-${clue.num}`);
                      
                      return (
                        <li 
                          key={`down-${clue.num}`} 
                          className={`
                            text-sm cursor-pointer p-2 rounded
                            ${isCorrect ? 'text-green-600 font-semibold' : ''}
                            ${selectedCell && selectedCell.col === clue.col && 
                              selectedCell.row >= clue.row && 
                              selectedCell.row < clue.row + clue.answer.length && 
                              direction === 'down' ? 
                              'bg-blue-100 dark:bg-blue-900' : ''}
                          `}
                          onClick={() => {
                            setSelectedCell({ row: clue.row, col: clue.col });
                            setDirection('down');
                            // Refocus after clicking
                            if (gameContainerRef.current) {
                              gameContainerRef.current.focus();
                            }
                          }}
                        >
                          <span className="font-semibold">{clue.num}.</span> {clue.clue}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="h-screen w-screen">
      {page === 'home' && renderHomePage()}
      {page === 'settings' && renderSettingsPage()}
      {page === 'game' && renderGamePage()}
    </div>
  );
}