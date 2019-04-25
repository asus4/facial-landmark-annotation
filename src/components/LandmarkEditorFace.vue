<template lang="pug">
g
  circle(v-for="{x, y} in landmarks" :cx="x" :cy="y" r="4" draggable="true")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class LandmarkEditorFace extends Vue {

  @Prop({ default: [] })
  public landmarks!: faceapi.IPoint[]
}
</script>

<style lang="sass" scoped>
circle
  stroke: #00ff00
  fill: none
  cursor: grab
  &:hover
    stroke: none
    fill: #00ff00
  &:active
    cursor: grabbing
</style>
