import type { Ref } from 'vue'
import type { BlockState } from './types'

const directions = [
  [1, 1],
  [1, 0],
  [0, 1],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [-1, -1],
]

export class Game {
  state = ref() as Ref<BlockState[][]>
  constructor(
    public width: number,
    public height: number,
  ) {
    this.reset()
  }

  reset(
    width = this.width,
    height = this.height,
  ) {
    this.width = width
    this.height = height
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
      ),
    )
    this.makerMines()
    this.updateNums()
  }

  updateNums() {
    this.state.value.forEach((row: BlockState[]) => {
      row.forEach((block: BlockState) => {
        if (block.mine)
          return
        for (const [dx, dy] of directions) {
          const x2 = block.x + dx
          const y2 = block.y + dy
          if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
            continue
          if (this.state.value[y2][x2].mine)
            block.adjacentMines += 1
        }
      })
    })
  }

  makerMines() {
    for (const row of this.state.value) {
      for (const block of row)
        block.mine = Math.random() < 0.1
    }
  }

  onClick(block: BlockState) {
    if (block.flagged)
      return
    block.revealed = true
    if (block.mine) {
      this.revealedMine()
      return
    }
    // this.checkGameState()
    this.revealedSibling(block)
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    // this.checkGameState()
  }

  revealedMine() {
    this.state.value.forEach((row) => {
      row.forEach((b) => {
        if (b.mine)
          b.revealed = true
      })
    })
    nextTick(() => {
      alert('GAME OVER')
    })
  }

  revealedSibling(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSibling(block)
      // .filter(item => !item.adjacentMines)
      .forEach((b) => {
        if (!b.revealed) {
          b.revealed = true
          this.revealedSibling(b)
        }
      })
  }

  getSibling(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x = block.x - dx
      const y = block.y - dy
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return undefined
      return this.state.value[y][x]
    }).filter(Boolean) as BlockState[]
  }

  checkGameState() {
    const blocks = this.state.value.flat()
    if (blocks.filter(block => block.mine).every(b => b.flagged))
      alert('You Win!')

    if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
      if (blocks.some(block => !block.revealed && block.mine))
        alert('You Win!')
    }
  }
}

