<script setup  lang="ts">
import type { BlockState } from '../pages/types'
defineProps<{ block: BlockState; isDev: Boolean }>()

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
</script>

<template>
  <button
    w-10 h-10
    border="1 gray-400/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      🚩
    </template>
    <template v-else-if="block.revealed || isDev">
      {{ block.mine ? '💣' : block.adjacentMines || '' }}
    </template>
  </button>
</template>
