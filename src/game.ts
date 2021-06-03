class Game {
  board: Cell[][];
  mines: {} = {};
  clock: number = 0;
  numFlags: number = 0;
  numRows: number;
  numCols: number;
  numMines: number;

  constructor(numRows: number, numCols: number, numMines: number) {
    this.board = new Array(numRows)
      .fill(0)
      .map((r, i) => new Array(10).fill(0).map((c, j) => new Cell(i, j, this)));
    this.numFlags = 0;
    this.clock = 0;
    this.numMines = numMines;
    this.numRows = numRows;
    this.numCols = numCols;

    this.populate();
  }

  // Populate the game board with mines and numbers around those mines
  populate(): void {
    let x: number;
    let y: number;
    for (let i = 0; i < this.numMines; i++) {
      // Choose a random cell in the board to make a mine
      x = Math.floor(Math.random() * this.numRows);
      y = Math.floor(Math.random() * this.numCols);
      this.board[x][y].val = -1;
      // Increment neighboring cells that are not mines
      for (let n of this.getNeighbors(x, y)) {
        if (n.val >= 0) n.val++;
      }
    }
  }

  getNeighbors(row: number, col: number): Cell[] {
    let results: Cell[] = [];
    let origin: Cell = this.board[row][col];
    // Left 3
    if (origin.col > 0) {
      results.push(this.board[row][col - 1]);
      if (origin.row > 0) results.push(this.board[row - 1][col - 1]);
      if (origin.row < this.numRows - 1)
        results.push(this.board[row + 1][col - 1]);
    }
    // Right 3
    if (origin.col < this.numCols - 1) {
      results.push(this.board[row][col + 1]);
      if (origin.row > 0) results.push(this.board[row - 1][col + 1]);
      if (origin.row < this.numRows - 1)
        results.push(this.board[row + 1][col + 1]);
    }
    // Above and below
    if (origin.row > 0) results.push(this.board[row - 1][col]);
    if (origin.row < this.numRows - 1) results.push(this.board[row + 1][col]);

    return results;
  }

  printBoard(): string {
    // Horizontal border
    // left border, mines remaining, smiley button, timer, right border
    // Horizontal border
    // for each row:
    //    left border, row contents, right border
    // Horizontal border
    

    
    return '';
  }
}
