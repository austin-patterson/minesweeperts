class Cell extends HTMLElement {
  row: number;
  col: number;
  val: number = 0;
  revealed: boolean = false;
  flagged: boolean = false;

  constructor(row: number, col: number) {
    super();
    this.row = row;
    this.col = col;
  }
}
