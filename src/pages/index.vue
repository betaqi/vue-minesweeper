<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
interface DifficultyMap {
  [key: string]: number
}

interface BlockState {
  x: number
  y: number
  mine?: boolean // 炸弹
  flagged?: boolean // 标记
  revealed?: boolean // 翻开
  adjacentMines: number // 相邻的地雷
}

let difficultyLevel = $ref('low')
const difficultyMap: DifficultyMap = {
  low: 10,
  mid: 15,
  high: 20,
}

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
function updateNums(state: BlockState[][]) {
  state.forEach((row: BlockState[]) => {
    row.forEach((block: BlockState) => {
      if (block.mine)
        return
      for (const [dx, dy] of directions) {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= difficultyMap[difficultyLevel] || y2 < 0 || y2 >= difficultyMap[difficultyLevel])
          continue
        if (state[y2][x2].mine)
          block.adjacentMines += 1
      }
    })
  })
}

function makerMines(state: any) {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
}

const data = computed(
  () => {
    const state = Array.from({ length: difficultyMap[difficultyLevel] }, (_, y) =>
      Array.from({ length: difficultyMap[difficultyLevel] }, (_, x): BlockState => ({
        x, y, adjacentMines: 0,
      }),
      ),
    )
    makerMines(state)
    updateNums(state)
    return state
  },
)
function onClick(block: BlockState) {
}

const blockColors = [
  'text-transparent border-transparent',
  'text-blue',
  'text-green',
  'text-yellow',
  'text-orange',
  'text-red',
  'text-purple',
  'text-pink',
]
function getBlockClass(block: BlockState) {
  return block.mine ? 'text-red' : blockColors[block.adjacentMines]
}

const difficulty = ['low', 'mid', 'high']

function changeDifficulty(level: string) {
  difficultyLevel = level
}
</script>

<template>
  <button
    v-for="item of difficulty" :key="item"
    btn m-3 text-sm mt-8
    @click="changeDifficulty(item)"
  >
    {{ item }}
  </button>
  <div v-for="(row, y) of data" :key="y">
    <button
      v-for="block of row" :key="block.x"
      w-10 h-10 hover:bg-gray
      border="1 gray-400/10"
      :class="getBlockClass(block)"
      @click="onClick(block)"
    >
      {{ block.mine ? '💣' : block.adjacentMines }}
    </button>
  </div>
</template>
