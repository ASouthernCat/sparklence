<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { ThreeApp } from './js/ThreeApp'
let webgl = ref(null)
let threeApp
onMounted(() => {
    console.log("hello threejs")
    threeApp = new ThreeApp(webgl.value)
    threeApp.render()
})
onUnmounted(() => {
    threeApp.clear()
})
</script>

<template>
    <canvas ref="webgl" class="webgl"></canvas>
</template>

<style>
.webgl {
    top: 0;
    left: 0;
    outline: none;
}
</style>