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
function onClick(block: BlockState) {
  block.revealed = true
}

function makerMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
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

function updateNums() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      for (const [dx, dy] of directions) {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
          continue
        if (state[y2][x2].mine)
          block.adjacentMines += 1
      }
    })
  })
}

makerMines()
updateNums()
</script>

<template>
  <div v-for="(row, y) of state" :key="y" flex="~" justify-center>
    <button
      v-for="block of row" :key="block.x"
      w-10 h-10
      hover="bg-gray/10"
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
