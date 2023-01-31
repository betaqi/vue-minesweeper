<script setup>
import confetti from 'canvas-confetti'

const props = defineProps({
  passed: {
    type: Boolean,
  },
})

function congrats() {
  const defaults = {
    shapes: ['square'],
    ticks: 500,
  }
  confetti({
    ...defaults,
    particleCount: 50,
    angle: 60,
    spread: 80,
    origin: { x: 0 },
  })
  confetti({
    ...defaults,
    particleCount: 50,
    angle: 120,
    spread: 80,
    origin: { x: 1 },
  })
}

watch(
  () => props.passed,
  (v) => {
    if (v) {
      setTimeout(congrats, 200)
      setTimeout(congrats, 400)
      setTimeout(congrats, 600)
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <div />
</template>
