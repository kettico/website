export type MSBoard = {
  id: number;
  name: string;
  cells: MSCell[][];
};

export type MSCell = {
  row: number;
  col: number;
  value: number; // -1 = bomb, 0 = empty, 1–8 = adjacent bombs
  status: string;
};
