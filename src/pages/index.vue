<script setup lang="ts">
import { GamePlay } from './core'
import { IntervalTime, difficulty, isDev, newGame, toggleDev } from './util'
defineOptions({
  name: 'IndexPage',
})

const play = new GamePlay(16, 16, 18)
const state = play.state
watchEffect(() => {
  play.checkGameState()
})

const time = computed(() => {
  return Math.round(((state.value.endMS ?? +IntervalTime.value) - (state.value.startMS ?? +IntervalTime.value)) / 1000)
})
</script>

<template>
  <div flex="~ gap1" justify-center p4>
    <button btn @click="toggleDev()">
      作弊模式{{ isDev }}
    </button>
    <button btn @click="play.reset()">
      New Game
    </button>
    <button
      v-for="(item, index) of difficulty" :key="index"
      btn @click="newGame(play, item)"
    >
      {{ item }}
    </button>
  </div>
  ⏱️{{ time }}
  <div v-for="(row, y) of state.data" :key="y" flex="~" justify-center>
    <Block
      v-for="block of row" :key="block.x"
      :block="block"
      :is-dev="isDev"
      @click="play.onClick(block)"
      @contextmenu.prevent="play.onRightClick(block)"
    />
  </div>
  <Confetti :passed="state.status === 'resove'" />
</template>
