class Cell extends HTMLDivElement {
  row: number;
  col: number;
  val: number = 0;
  hidden: boolean = true;
  flagged: boolean = false;

  constructor(row: number, col: number) {
    super();
    this.row = row;
    this.col = col;
  }
}
