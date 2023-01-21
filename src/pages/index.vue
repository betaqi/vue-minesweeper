<script setup lang="ts">
import { Game } from './composables/core'
import type { BlockState, Difficulty } from './composables/types'
defineOptions({
  name: 'IndexPage',
})
const difficulty: Difficulty[] = ['easy', 'medium', 'hard']
const game = new Game(12, 12, 10)
const state = game.state
const isDev = ref(false)
const toggleDev = useToggle(isDev)

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
  return block.mine ? 'bg-red-500' : blockColors[block.adjacentMines]
}

function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      game.reset(9, 9, 10)
      break
    case 'medium':
      game.reset(16, 16, 18)
      break
    case 'hard':
      game.reset(16, 30, 24)
      break
  }
}
watchEffect(() => {
  game.checkGameState()
})
</script>

<template>
  Mine Count :{{ state.flat().filter(r => r.mine).length }}
  <div flex="~ gap1" justify-center p4>
    <button btn @click="toggleDev()">
      作弊模式{{ isDev }}
    </button>
    <button btn @click="game.reset()">
      New Game
    </button>
    <button
      v-for="(item, index) of difficulty" :key="index"
      btn
      @click="newGame(item)"
    >
      {{ item }}
    </button>
  </div>
  <div
    v-for="(row, y) of state" :key="y"
    flex="~" justify-center
  >
    <button
      v-for="block of row" :key="block.x"
      w-10 h-10
      border="1 gray-400/10"
      :class=" getBlockClass(block)"
      @click=" game.onClick(block)"
      @contextmenu.prevent=" game.onRightClick(block)"
    >
      <template v-if="block.flagged">
        🚩
      </template>
      <template v-else-if="block.revealed || isDev">
        {{ block.mine ? '💣' : block.adjacentMines }}
      </template>
    </button>
  </div>
  <Confetti />
</template>
