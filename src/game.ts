class Game {
  board: Cell[][];
  mines: any = {};
  clock: number = 0;
  numFlags: number = 0;
  numRows: number;
  numCols: number;
  numMines: number;

  constructor(numRows: number, numCols: number, numMines: number) {
    this.board = new Array(numRows)
      .fill(0)
      .map((r, i) =>
        new Array(numCols).fill(0).map((c, j) => new Cell(i, j, this))
      );
    this.numFlags = 0;
    this.clock = 0;
    this.numMines = numMines;
    this.numRows = numRows;
    this.numCols = numCols;

    this.populate();
    // console.log(this.printBoard()); //DEBUG
  }

  // Populate the game board with mines and numbers around those mines
  populate(): void {
    let x: number;
    let y: number;
    for (let i = 0; i < this.numMines; i++) {
      // Choose a random cell in the board to make a mine
      x = Math.floor(Math.random() * this.numRows);
      y = Math.floor(Math.random() * this.numCols);
      if (this.board[x][y].val !== -1) {
        this.board[x][y].val = -1;
        // Increment neighboring cells that are not mines
        for (let n of this.getNeighbors(this.board[x][y])) {
          if (n.val >= 0) n.val++;
        }

        this.mines[`${x},${y}`] = this.board[x][y];
      } else i--; // Pick again if already a mine
    }
  }

  getNeighbors(origin: Cell): Cell[] {
    const row = origin.row;
    const col = origin.col;
    let results: Cell[] = [];
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
    const horizontalLine = "--".concat(...Array(this.numCols).fill("-"), "\n");
    const mine = "X";
    const blank = ".";
    let currentLine: string;
    let lines = [];
    // /*TODO: Update this line to show flags remaining, reset button, and timer*/
    // lines.push("|### - :) - ###|\n");
    // lines.push(horizontalLine);

    for (let row of this.board) {
      currentLine = "|";
      for (let cell of row) {
        if (cell.val < 0) currentLine += mine;
        else if (cell.val === 0) currentLine += blank;
        else currentLine += cell.val;
      }
      currentLine += "|\n";
      lines.push(currentLine);
    }

    return horizontalLine.concat(...lines, horizontalLine);
  }

  defeat(cell: Cell): void {
    /** TODO:
     * make cell solid red with bomb
     * reveal all bombs
     * make "death" cell red
     */
  }

  victory(): void {}

  reveal(origin: Cell): void {
    if (origin.val < 0) this.defeat(origin);
    let queue: Cell[] = [origin];
    let current: Cell | undefined;

    while (queue.length > 0) {
      current = queue.shift();
      if (typeof current === "undefined") break; //FIXME: find a more elegant solution
      // TODO: update display
      current.hidden = false;
      if (current.val === 0) {
        for (let n of this.getNeighbors(origin)) {
          if (n.hidden) queue.push(n);
        }
      }
    }
  }

  // Setup event listeners? Draw board into dev.minesweeper-board
  init(): void {
    let root: HTMLElement | null = document.getElementById("ms-board");
    if (root == null) return;
    let field: HTMLDivElement = document.createElement("div");
    let header: HTMLDivElement = document.createElement("div");
    let flagCounter: HTMLDivElement = document.createElement("div");
    let btn: HTMLDivElement = document.createElement("div");
    let timer: HTMLDivElement = document.createElement("div");

    // EventListeners
    // Btn handlers
    const toggleWow = () => {
      btn.classList.toggle("ms-smiley");
      btn.classList.toggle("ms-wow");
    };

    const toggleBtnPressed = () => {
      btn.classList.toggle("ms-smiley");
      btn.classList.toggle("ms-smiley-pressed");
    };
    btn.onmousedown = toggleBtnPressed;
    btn.onmouseup = toggleBtnPressed;

    // Move toggleWow functionality into here and figure out how to connect this
    // const toggleCellPressed = () => {};

    // Build Header
    flagCounter.innerHTML = `<div class="ms-digit ms-0"></div><div class="ms-digit ms-0"></div><div class="ms-digit ms-0"></div>`;
    timer.innerHTML = `<div class="ms-digit ms-0"></div><div class="ms-digit ms-0"></div><div class="ms-digit ms-0"></div>`;
    flagCounter.classList.add("ms-num-display");
    timer.classList.add("ms-num-display");
    btn.classList.add("ms-btn", "ms-smiley");
    header.classList.add("ms-header");
    header.appendChild(flagCounter);
    header.appendChild(btn);
    header.appendChild(timer);

    // Build Field
    for (let i = 0; i < this.numCols * this.numRows; i++) {
      let div = document.createElement("div");
      div.classList.add("ms-cell", "ms-hidden");
      // div.onclick(/** TODO */)
      div.onmousedown = toggleWow;
      div.onmouseup = toggleWow;
      field.appendChild(div);
      console.log("test");
    }
    field.classList.add("ms-field");

    root.appendChild(header);
    root.appendChild(field);
  }
}
