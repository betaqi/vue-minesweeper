<script setup lang="ts">
import { GamePlay } from './core'

const play = new GamePlay(10, 10)
const stast = play.state

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div v-for="(row, y) of stast.data" :key="y" flex="~" justify-center>
    <Block
      v-for="block of row" :key="block.x"
      :block="block"
      @click="play.onClick(block)"
      @contextmenu.prevent="play.onRightClick($event, block)"
    />
  </div>
</template>
