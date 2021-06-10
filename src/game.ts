class Game {
  board!: Cell[][];
  mines: any = {}; // TODO: how am I using this?
  flags: any = {}; // TODO: how am I using this?
  clock: number = 0;
  numFlags: number = 0;
  flagCounter!: HTMLDivElement;
  btn!: HTMLDivElement;
  timer!: HTMLDivElement;

  constructor(
    private numRows: number,
    private numCols: number,
    private numMines: number
  ) {
    this.numFlags = 0;
    this.clock = 0;
  }

  // Populate the game board with mines and numbers around those mines
  populateMines(): void {
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

    while (
      queue.length > 0 &&
      typeof (current = queue.shift()) !== "undefined"
    ) {
      // TODO: update display
      current.revealed = true;
      if (current.val === 0) {
        for (let n of this.getNeighbors(origin)) {
          if (n.revealed) queue.push(n);
        }
      }
    }
  }

  /**
  genHeader(): HTMLDivElement {
    let header: HTMLDivElement = document.createElement("div");
    this.flagCounter = document.createElement("div");
    this.btn = document.createElement("div");
    this.timer = document.createElement("div");

    this.flagCounter.innerHTML = `<div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div>`;
    this.timer.innerHTML = `<div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div>`;

    this.flagCounter.classList.add("ms-num-display");
    this.timer.classList.add("ms-num-display");
    this.btn.classList.add("ms-btn", "ms-smiley", "classic");
    header.classList.add("ms-header");

    this.btn.onmousedown = this.toggleBtnPressed;
    this.btn.onmouseup = this.toggleBtnPressed;
    this.btn.onmouseleave = (event: MouseEvent) => {
      if (this.btn.classList.contains("ms-smiley-pressed"))
        this.toggleBtnPressed(event);
    };

    header.appendChild(this.flagCounter);
    header.appendChild(this.btn);
    header.appendChild(this.timer);

    return header;
  }
  */

  /**
  genField(): HTMLDivElement {
    let field: HTMLDivElement = document.createElement("div");

    this.board = new Array(this.numRows).fill(0).map((r, i) =>
      new Array(this.numCols).fill(0).map((c, j) => {
        let cell: Cell = new Cell(i, j);
        cell.classList.add("ms-cell", "ms-hidden", "classic");
        cell.onmousedown = this.toggleCellPressed;
        cell.onmouseup = this.toggleCellPressed;
        cell.onmouseleave = (event: MouseEvent) => {
          if (cell.classList.contains("ms-cell-pressed"))
            this.toggleCellPressed(event);
        };
        cell.onclick = () => game.reveal(cell);
        field.appendChild(cell);
        return cell;
      })
    );

    field.classList.add("ms-field");
    return field;
  }
  */

  // Event Handlers
  // TODO: check for left (event.button === 0) vs right (event.button === 2)
  // TODO: toggle ms-cell-pressed
  toggleCellPressed(event: MouseEvent) {
    if (event == null) return;
    this.btn?.classList.toggle("ms-smiley");
    this.btn?.classList.toggle("ms-wow");

    if (event.button === 0) {
      //left click
      let cell: Cell = event?.target as Cell;
      cell.classList.toggle("ms-hidden");
      cell.classList.toggle("ms-cell-pressed");
    }
  }

  toggleBtnPressed(event: MouseEvent) {
    // if (event.button !== 0) return;
    this.btn?.classList.toggle("ms-smiley");
    this.btn?.classList.toggle("ms-smiley-pressed");
  }

  init(): void {
    let root: HTMLElement | null = document.getElementById("ms-board");
    if (root == null) return;

    customElements.define("ms-cell", Cell);

    const genHeader = () => {
      let header: HTMLDivElement = document.createElement("div");
      this.flagCounter = document.createElement("div");
      this.btn = document.createElement("div");
      this.timer = document.createElement("div");

      this.flagCounter.innerHTML = `<div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div>`;
      this.timer.innerHTML = `<div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div><div class="classic ms-digit ms-0"></div>`;

      this.flagCounter.classList.add("ms-num-display");
      this.timer.classList.add("ms-num-display");
      this.btn.classList.add("ms-btn", "ms-smiley", "classic");
      header.classList.add("ms-header");

      this.btn.onmousedown = this.toggleBtnPressed;
      this.btn.onmouseup = this.toggleBtnPressed;
      // this.btn.onmouseleave = (event: MouseEvent) => {
      //   if (this.btn.classList.contains("ms-smiley-pressed"))
      //     this.toggleBtnPressed(event);
      // };

      header.appendChild(this.flagCounter);
      header.appendChild(this.btn);
      header.appendChild(this.timer);

      return header;
    };

    const genField = () => {
      let field: HTMLDivElement = document.createElement("div");

      // ! TODO: Try unpacking this into explicit loops? Only creating 1 element...
      this.board = new Array(this.numRows).fill(0).map((r, i) =>
        new Array(this.numCols).fill(0).map((c, j) => {
          let cell: Cell = new Cell(i, j);
          cell.classList.add("ms-cell", "ms-hidden", "classic");
          cell.onmousedown = this.toggleCellPressed;
          cell.onmouseup = this.toggleCellPressed;
          // cell.onmouseleave = (event: MouseEvent) => {
          //   if (cell.classList.contains("ms-cell-pressed"))
          //     this.toggleCellPressed(event);
          // };
          cell.onclick = () => game.reveal(cell);
          field.appendChild(cell);
          return cell;
        })
      );

      field.classList.add("ms-field");
      return field;
    };

    root.appendChild(genHeader());
    root.appendChild(genField());
  }
}
