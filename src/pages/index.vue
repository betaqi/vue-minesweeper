<script setup lang="ts">
import { GamePlay } from './core'

const play = new GamePlay(5, 5, 3)
const state = play.state

watchEffect(() => {
  play.checkGameState()
})

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div v-for="(row, y) of state.data" :key="y" flex="~" justify-center>
    <Block
      v-for="block of row" :key="block.x"
      :block="block"
      @click="play.onClick(block)"
      @contextmenu.prevent="play.onRightClick(block)"
    />
  </div>
  <Confetti :passed="state.status === 'resove'" />
</template>
