<script setup lang="ts">
const WIDTH = 10
const HEIGHT = 10
defineOptions({
  name: 'IndexPage',
})

interface BlockState {
  x: number
  y: number
  mine?: boolean // 炸弹
  flagged?: boolean // 标记
  revealed: boolean // 翻开
  adjacentMines: number // 相邻的地雷
}

const blockColors = [
  'text-transparent',
  'text-blue',
  'text-green',
  'text-yellow',
  'text-orange',
  'text-red',
  'text-purple',
  'text-pink',
]
function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-600/10'

  return block.mine ? 'text-red' : blockColors[block.adjacentMines]
}

const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x,
      y,
      adjacentMines: 0,
      revealed: false,
    }),
    ),
  ),
)

let makerMine = false

function onClick(block: BlockState) {
  if (!makerMine) {
    makerMines(block)
    updateNums()
    makerMine = true
  }

  block.revealed = true
  revealedBlock(block)
  if (block.mine)
    revealedMines()
}

function makerMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue

      if (Math.abs(block.y - initial.y) <= 1)
        continue

      block.mine = Math.random() < 0.3
    }
  }
}

function updateNums() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function revealedBlock(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block)
    .filter(item => !item.adjacentMines)
    .forEach((b) => {
      if (!b.revealed) {
        b.revealed = true
        revealedBlock(b)
      }
    })
}

function revealedMines() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        block.revealed = true
    })
  })
  setTimeout(() => {
    alert('GAME OVER')
  })
}

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
function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    return state[y2][x2]
  }).filter(Boolean) as BlockState []
}
</script>

<template>
  <div v-for="(row, y) of state" :key="y" flex="~" justify-center>
    <button
      v-for="block of row" :key="block.x"
      w-10 h-10
      border="1 gray-400/10"
      :class="getBlockClass(block)"
      @click="onClick(block)"
    >
      <template v-if="block.revealed">
        {{ block.mine ? '💣' : block.adjacentMines }}
      </template>
    </button>
  </div>
</template>
