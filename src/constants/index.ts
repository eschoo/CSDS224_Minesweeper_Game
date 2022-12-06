import "../comps/App/index"
import "../utils/index"
import { generateCells, openMultipleCells } from "../utils/index";
let level = 0;
let MAX_ROWS = 9;
let MAX_COLS = 9;
let NUM_MINE = 10;

function changeDifficulty(difficulty = 0) {
  
    level = difficulty
    
    if (level === 0) {
        MAX_ROWS = 9;
        MAX_COLS = 9;
        NUM_MINE = 10;

    } else if (level === 1) {
        MAX_ROWS = 15;
        MAX_COLS = 15;
        NUM_MINE = 20;
    } else if (level === 2) {
        MAX_ROWS = 20;
        MAX_COLS = 20;
        NUM_MINE = 30;

    } else if (level === 3){
        MAX_ROWS = 25;
        MAX_COLS = 25;
        NUM_MINE = 50;
    }

    generateCells();
}
export{MAX_ROWS, MAX_COLS, NUM_MINE, changeDifficulty}