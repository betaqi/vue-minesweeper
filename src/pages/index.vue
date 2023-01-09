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
  revealed: boolean // 翻开
  adjacentMines: number // 相邻的地雷
}

const difficulty = ['low', 'mid', 'high']
const state = ref(initState())
let difficultyLevel = $ref('low')
const difficultyMap: DifficultyMap = {
  low: 10,
  mid: 15,
  high: 20,
}

function initState(level = 10) {
  const data = Array.from({ length: level }, (_, y) =>
    Array.from({ length: level }, (_, x): BlockState => ({
      x,
      y,
      adjacentMines: 0,
      revealed: false,
    }),
    ),
  )
  nextTick(() => {
    makerMines()
    updateNums()
  })
  return data
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
function updateNums() {
  state.value.forEach((row: BlockState[]) => {
    row.forEach((block: BlockState) => {
      if (block.mine)
        return
      for (const [dx, dy] of directions) {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= difficultyMap[difficultyLevel] || y2 < 0 || y2 >= difficultyMap[difficultyLevel])
          continue
        if (state.value[y2][x2].mine)
          block.adjacentMines += 1
      }
    })
  })
}

function makerMines() {
  for (const row of state.value) {
    for (const block of row)
      block.mine = Math.random() < 0.2
  }
}

function onClick(block: BlockState) {
  block.revealed = true
  if (block.mine) {
    revealedMine()
    return
  }
  checkGameState()
  revealedSibling(block)
}

function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function revealedMine() {
  state.value.forEach((row) => {
    row.forEach((b) => {
      if (b.mine)
        b.revealed = true
    })
  })
  nextTick(() => {
    alert('GAME OVER')
  })
}

function revealedSibling(block: BlockState) {
  if (block.adjacentMines)
    return

  getSibling(block)
    // .filter(item => !item.adjacentMines)
    .forEach((b) => {
      if (!b.revealed) {
        b.revealed = true
        revealedSibling(b)
      }
    })
}

function getSibling(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x = block.x - dx
    const y = block.y - dy
    if (x < 0 || x >= difficultyMap[difficultyLevel] || y < 0 || y >= difficultyMap[difficultyLevel])
      return undefined
    return state.value[y][x]
  }).filter(Boolean) as BlockState[]
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
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'text-red' : blockColors[block.adjacentMines]
}

function changeDifficulty(level: string) {
  difficultyLevel = level
  state.value = initState(difficultyMap[difficultyLevel])
}

function checkGameState() {
  const blocks = state.value.flat()

  if (blocks.filter(block => block.mine).every(b => b.flagged))
    alert('You Win!')

  if (blocks.every(block => block.revealed || block.flagged || block.mine)) {
    if (blocks.some(block => !block.revealed && block.mine))
      alert('You Win!')
  }
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
  <div
    v-for="(row, y) of state" :key="y"
    flex="~" justify-center
  >
    <button
      v-for="block of row" :key="block.x"
      w-10 h-10
      border="1 gray-400/10"
      :class="getBlockClass(block)"
      @click="onClick(block)"
      @contextmenu.prevent="onRightClick(block)"
    >
      <template v-if="block.flagged">
        🚩
      </template>
      <template v-else-if="block.revealed">
        {{ block.mine ? '💣' : block.adjacentMines }}
      </template>
    </button>
  </div>
</template>
