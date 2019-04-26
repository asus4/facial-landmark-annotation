<template lang="pug">
.timeline
  .columns
    .column.is-full
      input.slider(ref="timeSlider" type="range" value="0" min="0" :max="total" @change="onTimeSliderChange")
  .cotainer
    b-field(label="Frame")
      b-numberinput(controls-position="compact"
        v-model="current"
        min="0" :max="total"
      )
    .columns
      .column
        button.button(@click="autoDetect") Auto Detect
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class Timeline extends Vue {

  public $refs!: {
    timeSlider: HTMLInputElement;
  }

  private get current(): number {
    return AppModule.currentFrame
  }

  private set current(n: number) {
    AppModule.setCurrentFrame(n)
  }

  private get total(): number {
    return Math.ceil(AppModule.totalFrame)
  }

  private increment() {
    AppModule.nextFrame()
  }

  private decrement() {
    AppModule.prevFrame()
  }

  private onTimeSliderChange(e: Event) {
    AppModule.setCurrentFrame(this.$refs.timeSlider.valueAsNumber)
  }

  private autoDetect() {
    console.log('autodetect')
  }

}
</script>

<style lang="sass" scoped>
.timeline
  width: 100%

.slider
  width: 100%

</style>
