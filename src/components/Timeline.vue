
<template lang="pug">
.timeline
  h1 timeline
  input.slider(ref="timeSlider" type="range" value="0" min="0" :max="total" @change="onTimeSliderChange")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule, IFace } from '@/store/modules/timeline'
import * as faceapi from 'face-api.js'

interface Payload {
  event: DragEvent,
  index: number,
  row: IFace
}

@Component({
  components: {},
})
export default class Timeline extends Vue {

  public $refs!: {
    timeSlider: HTMLInputElement;
  }

  private get current(): number { return AppModule.currentFrame }
  private set current(n: number) { AppModule.setCurrentFrame(n) }

  private get total(): number { return Math.ceil(AppModule.totalFrame) }

  private onTimeSliderChange(e: Event) {
    AppModule.setCurrentFrame(this.$refs.timeSlider.valueAsNumber)
  }
}
</script>

<style lang="sass" scoped>
.timeline
  position: relative
.slider
  width: 100%


</style>
