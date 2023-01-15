export interface DifficultyMap {
  [key: string]: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface BlockState {
  x: number
  y: number
  mine?: boolean // 炸弹
  flagged?: boolean // 标记
  revealed: boolean // 翻开
  adjacentMines: number // 相邻的地雷
}
