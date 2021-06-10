class Cell {
  game: Game;
  row: number;
  col: number;
  val: number = 0;
  hidden: boolean = true;
  flagged: boolean = false;

  constructor(row: number, col: number, game: Game) {
    this.row = row;
    this.col = col;
    this.game = game;
  }

  onclick(click: Event): void {
    this.game.reveal(this);
  }
}
