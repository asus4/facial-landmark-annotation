
<template lang="pug">
.controls.cotainer
  .columns
    b-field.column(label="Frame:")
      b-tooltip(label="Prev: (,) Next: (.)" type="is-light")
        b-numberinput(controls-position="compact"
          v-model="current"
          min="0" :max="total"
        )
    b-field.column(label="Commands:")
      .columns
        .column
          button.button(@click="startAutoProcess") Start Auto
    b-field.column(label="Threshold:")
      b-numberinput(controls-position="compact"
        v-model="scoreThreshold"
        min="0" max="1" step="0.05"
      )
  b-loading(:active.sync="isAutoProcess" canCancel @onCancel="stopAutoProcess")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class Controls extends Vue {

  public $refs!: {
    timeSlider: HTMLInputElement;
  }

  private scoreThreshold = new faceapi.TinyFaceDetectorOptions().scoreThreshold

  private get current(): number { return AppModule.currentFrame }
  private set current(n: number) { AppModule.setCurrentFrame(n) }

  private get total(): number { return Math.ceil(AppModule.totalFrame) }

  private get isAutoProcess() { return AppModule.isAutoProcess }
  private set isAutoProcess(value: boolean) {
    if (value) {
      AppModule.startAutoProcess()
    } else {
      AppModule.stopAutoProcess()
    }
  }

  private startAutoProcess() {
    this.isAutoProcess = true
  }

  private stopAutoProcess() {
    this.isAutoProcess = false
  }

  @Watch('scoreThreshold')
  private onScoreThresholdChnaged(value: number) {
    AppModule.setScoreThreshold(value)
  }

}
</script>

<style lang="sass" scoped>
.controls
  width: 100%

.slider
  width: 100%

</style>
