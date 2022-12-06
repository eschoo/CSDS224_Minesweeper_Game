import {MAX_COLS, MAX_ROWS, NUM_MINE} from "../constants";
import {CellValue, CellState, Cell} from "../types"

const adjCells = (
    cells: Cell[][],
    rowParam: number,
    colParam: number
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {
    const topLeftCell = rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
    const topCell = rowParam > 0 ? cells[rowParam - 1][colParam]: null;
    const topRightCell = rowParam > 0 && colParam < MAX_COLS - 1? cells[rowParam - 1][colParam + 1]: null;
    const leftCell = colParam > 0 ? cells[rowParam][colParam - 1]: null;
    const rightCell = colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1]: null;
    const bottomLeftCell = rowParam < MAX_ROWS - 1 && colParam > 0 ? cells[rowParam + 1][colParam - 1]: null;
    const bottomCell = rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam]: null;
    const bottomRightCell = rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1 ? cells[rowParam + 1][colParam + 1]: null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
      };
}
export const generateCells = (): Cell[][] => {
    let cells: Cell [][] = [];

    //generating cells
    for(let row = 0; row < MAX_ROWS; row++){
        cells.push([]);
        for(let col = 0; col < MAX_COLS; col++){
            cells[row].push({
                value: CellValue.zero,
                state: CellState.open
            });
        }
    }

    //randomly place bomb
    let mines = 0;
    while(mines < NUM_MINE){
        const rows = Math.floor(Math.random() * MAX_ROWS);
        const cols = Math.floor(Math.random() * MAX_COLS);
        const currCell = cells[rows][cols];
        if(currCell.value !== CellValue.bomb){
            cells[rows][cols] = {
                ...cells[rows][cols], value: CellValue.bomb
            }
            mines++;
        }
    }
    for(let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++){
        for(let colIndex = 0; colIndex < MAX_COLS; colIndex++){
            const currCell = cells[rowIndex][colIndex];
            if(currCell.value === CellValue.bomb){
                continue;
            }
            let noOfBomb = 0;
            const topLeftBomb = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
            const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex]: null;
            const topRightBomb = rowIndex > 0 && colIndex < MAX_COLS - 1? cells[rowIndex - 1][colIndex + 1]: null;
            const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1]: null;
            const rightBomb = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1]: null;
            const bottomLeftBomb = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1]: null;
            const bottomBomb = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex]: null;
            const bottomRightBomb = rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1]: null;

            if(topLeftBomb && topLeftBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(topBomb && topBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(topRightBomb && topRightBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(leftBomb && leftBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(rightBomb && rightBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(bottomLeftBomb && bottomLeftBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(bottomBomb && bottomBomb.value === CellValue.bomb){
                noOfBomb++;
            }
            if(bottomRightBomb && bottomRightBomb.value === CellValue.bomb){
                noOfBomb++;
            }

            if(noOfBomb > 0){
                cells[rowIndex][colIndex] = {
                    ...currCell,
                    value: noOfBomb
                }
            }


        }
    }
    return cells;
};

export const openMultipleCells = (
    cells: Cell[][],
    rowParam: number,
    colParam: number
  ): Cell[][] => {
    const currentCell = cells[rowParam][colParam];
  
    if (
      currentCell.state === CellState.visible ||
      currentCell.state === CellState.flagged
    ) {
      return cells;
    }
  
    let newCells = cells.slice();
    newCells[rowParam][colParam].state = CellState.visible;
  
    const {
      topLeftCell,
      topCell,
      topRightCell,
      leftCell,
      rightCell,
      bottomLeftCell,
      bottomCell,
      bottomRightCell
    } = adjCells(cells, rowParam, colParam);
  
    if (
      topLeftCell?.state === CellState.open &&
      topLeftCell.value !== CellValue.bomb
    ) {
      if (topLeftCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
      } else {
        newCells[rowParam - 1][colParam - 1].state = CellState.visible;
      }
    }
  
    if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
      if (topCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam - 1, colParam);
      } else {
        newCells[rowParam - 1][colParam].state = CellState.visible;
      }
    }
  
    if (
      topRightCell?.state === CellState.open &&
      topRightCell.value !== CellValue.bomb
    ) {
      if (topRightCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
      } else {
        newCells[rowParam - 1][colParam + 1].state = CellState.visible;
      }
    }
  
    if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
      if (leftCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam, colParam - 1);
      } else {
        newCells[rowParam][colParam - 1].state = CellState.visible;
      }
    }
  
    if (
      rightCell?.state === CellState.open &&
      rightCell.value !== CellValue.bomb
    ) {
      if (rightCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam, colParam + 1);
      } else {
        newCells[rowParam][colParam + 1].state = CellState.visible;
      }
    }
  
    if (
      bottomLeftCell?.state === CellState.open &&
      bottomLeftCell.value !== CellValue.bomb
    ) {
      if (bottomLeftCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
      } else {
        newCells[rowParam + 1][colParam - 1].state = CellState.visible;
      }
    }
  
    if (
      bottomCell?.state === CellState.open &&
      bottomCell.value !== CellValue.bomb
    ) {
      if (bottomCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam + 1, colParam);
      } else {
        newCells[rowParam + 1][colParam].state = CellState.visible;
      }
    }
  
    if (
      bottomRightCell?.state === CellState.open &&
      bottomRightCell.value !== CellValue.bomb
    ) {
      if (bottomRightCell.value === CellValue.zero) {
        newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
      } else {
        newCells[rowParam + 1][colParam + 1].state = CellState.visible;
      }
    }
  
    return newCells;
  };