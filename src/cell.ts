class Cell {
  game: Game;
  hidden: boolean = true;
  val: number = 0;
  row: number;
  col: number;

  constructor(row: number, col: number, game: Game) {
    this.row = row;
    this.col = col;
    this.game = game;
  }
}
