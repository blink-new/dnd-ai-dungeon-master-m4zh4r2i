export interface Entity {
  id: string;
  type: 'player' | 'enemy';
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  initiative: number;
}
