import type { Ref } from 'vue'
import type { BlockState, GameStatus } from './types'

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

interface GameState {
  data: BlockState[][]
  status: GameStatus
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(
    public width: number,
    public height: number,
  ) {
    this.reset(width, height)
  }

  reset(width: number, height: number) {
    this.width = width
    this.height = height
    this.state.value = {
      status: 'pending',
      data: Array.from({ length: this.width }, (_, y) =>
        Array.from({ length: this.height }, (_, x) => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        })),
      ),
    }
  }

  onClick(block: BlockState) {
    if (block.flagged)
      return
    if (this.state.value.status === 'pending') {
      this.makerMines(block)
      this.updateNums()
      this.state.value.status = 'playing'
    }

    block.revealed = true
    this.revealedBlock(block)
    this.checkGameState()
    if (block.mine)
      this.revealedMines()
  }

  makerMines(initial: BlockState) {
    for (const row of this.state.value.data) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1)
          continue
        block.mine = Math.random() < 0.3
      }
    }
  }

  updateNums() {
    this.state.value.data.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  revealedBlock(block: BlockState) {
    if (block.adjacentMines)
      return
    this.getSiblings(block)
      // .filter(item => !item.adjacentMines)
      .forEach((b) => {
        if (!b.revealed && !b.flagged) {
          b.revealed = true
          this.revealedBlock(b)
        }
      })
  }

  onRightClick(e: Event, block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    if (this.state.value.status === 'playing')
      this.checkGameState()
  }

  revealedMines() {
    this.state.value.data.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          block.revealed = true
      })
    })
    setTimeout(() => {
      alert('GAME OVER')
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.state.value.data[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  checkGameState() {
    const blocks = this.state.value.data.flat()
    if (blocks.filter(block => block.mine).every(b => b.flagged))
      alert('You Win!')
    if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
      if (blocks.some(block => !block.revealed && block.mine))
        alert('You Win!')
    }
  }
}
