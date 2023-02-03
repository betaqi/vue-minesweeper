import type { GamePlay } from './core'
import type { Difficulty } from './types'
export const IntervalTime = ref(Date.now())

export const isDev = ref(false)
export const toggleDev = useToggle(isDev)

export const difficulty: Difficulty[] = ['easy', 'medium', 'hard']
export function newGame(play: GamePlay, difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 20)
      break
    case 'hard':
      play.reset(30, 18, 40)
      break
  }
}
