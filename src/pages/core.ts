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
    public mine: number,
  ) {
    this.reset(width, height, mine)
  }

  reset(width: number, height: number, mine: number) {
    this.width = width
    this.height = height
    this.mine = mine
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

  randomCount(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min)
  }

  makerMines(initial: BlockState) {
    const placeRandom = () => {
      const x = this.randomCount(0, this.width - 1)
      const y = this.randomCount(0, this.height - 1)
      const block = this.state.value.data[y][x]
      if ((Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1))
        return false
      if (block.mine)
        return false
      block.mine = true
      return true
    }

    Array.from({ length: this.mine }).forEach((_) => {
      let place = false
      while (!place)
        place = placeRandom()
    })
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
    // this.checkGameState()
    if (block.mine)
      this.state.value.status = 'reject'
  }

  onRightClick(block: BlockState) {
    if (!block.revealed && this.state.value.status === 'playing')
      block.flagged = !block.flagged
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
    if (this.state.value.status === 'pending')
      return
    if (this.state.value.status === 'reject') {
      this.revealedMines()
      return
    }
    const blocks = this.state.value.data.flat()
    if (
      blocks.filter(blocks => !blocks.mine).every(b => b.revealed)
        && blocks.filter(block => block.mine).every(b => b.flagged)
    )
      this.state.value.status = 'resove'
    if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
      if (
        blocks.some(block => !block.revealed && block.mine)
         && blocks.filter(blocks => !blocks.mine).every(b => b.revealed)
      )
        this.state.value.status = 'resove'
    }
  }

  revealedMines() {
    this.state.value.data.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          block.revealed = true
      })
    })
  }
}
