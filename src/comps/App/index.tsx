import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { Cell, CellState, CellValue, Face } from '../../types';
import {
  MAX_ROWS,
  MAX_COLS,
  NUM_MINE,
  changeDifficulty,
} from '../../constants';

//container for the game
//where most of the logic will take place
const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NUM_MINE);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  let level = 0;

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.omg);
    };

    const handleMouseUp = (): void => {
      setFace(Face.smile);
    };
    window.addEventListener('mousedown', handleMouseDown, live);
    window.addEventListener('mouseup', handleMouseUp, live);

    return () => {
      if (live) {
        window.removeEventListener('mousedown', handleMouseDown, live);
        window.removeEventListener('mouseup', handleMouseUp, live);
      }
    };
  }, []);

  useEffect(() => {
    if (live && time < 999 && !hasWon && !hasLost) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const lost = useRef(false);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.win);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();
    let currCell = cells[rowParam][colParam];
    // start the game
    if (!hasWon && !hasLost && !live) {
      while (currCell.value === CellValue.bomb) {
        newCells = generateCells();
        currCell = newCells[rowParam][colParam];
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    //playing the game
    if (!hasWon && !hasLost) {
      if (currentCell.value === CellValue.bomb) {
        setHasLost(true);
        newCells[rowParam][colParam].red = true;
        newCells = showAllBombs();
        setCells(newCells);
        setLive(false);
        return;
      } else if (currentCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam, colParam);
      } else {
        newCells[rowParam][colParam].state = CellState.visible;
      }

      // Check to see if you have won
      let safeOpenCellsExists = false;
      for (let row = 0; row < MAX_ROWS; row++) {
        for (let col = 0; col < MAX_COLS; col++) {
          const currentCell = newCells[row][col];

          if (
            currentCell.value !== CellValue.bomb &&
            currentCell.state === CellState.open
          ) {
            safeOpenCellsExists = true;
            break;
          }
        }
      }

      if (!safeOpenCellsExists) {
        newCells = newCells.map((row) =>
          row.map((cell) => {
            if (cell.value === CellValue.bomb) {
              return {
                ...cell,
                state: CellState.flagged,
              };
            }
            return cell;
          })
        );
        setHasWon(true);
      }

      setCells(newCells);
    }
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();
      if (!hasWon && !hasLost) {
        if (!live) {
          return;
        }

        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
          return;
        } else if (currentCell.state === CellState.open) {
          currentCells[rowParam][colParam].state = CellState.flagged;
          setCells(currentCells);
          setBombCounter(bombCounter - 1);
        } else if (currentCell.state === CellState.flagged) {
          currentCells[rowParam][colParam].state = CellState.open;
          setCells(currentCells);
          setBombCounter(bombCounter + 1);
        }
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setBombCounter(NUM_MINE);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
  };

  const handleInput = (e: number): void => {
    console.log(e);
    changeDifficulty(e);
    setBombCounter(NUM_MINE);
    setLive(false);
    setTime(0);
    setHasLost(false);
    setHasWon(false);
    setCells(generateCells());
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
          red={cell.red}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div className="App">
      <div className="difficulty">
        <button name="button" id="easy" onClick={() => handleInput(0)}>
          Easy
        </button>
        <button name="button" id="medium" onClick={() => handleInput(1)}>
          Medium
        </button>
        <button name="button" id="hard" onClick={() => handleInput(2)}>
          Hard
        </button>
        <button name="button" id="impossible" onClick={() => handleInput(3)}>
          Impossible
        </button>
      </div>
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div
        className="Body"
        style={{
          gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
        }}
      >
        {renderCells()}
      </div>
    </div>
  );
};

export default App;
