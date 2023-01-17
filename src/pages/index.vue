<script setup lang="ts">
import { Game } from './composables/core'
import type { BlockState, Difficulty } from './composables/types'
defineOptions({
  name: 'IndexPage',
})
const difficulty: Difficulty[] = ['easy', 'medium', 'hard']
const game = new Game(12, 12)
const state = game.state

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

function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      game.reset(9, 9)
      break
    case 'medium':
      game.reset(16, 16)
      break
    case 'hard':
      game.reset(16, 30)
      break
  }
}
watchEffect(() => {
  game.checkGameState()
})
</script>

<template>
  <div flex="~ gap1" justify-center p4>
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
      <template v-else-if="block.revealed || true">
        {{ block.mine ? '💣' : block.adjacentMines }}
      </template>
    </button>
  </div>
</template>
