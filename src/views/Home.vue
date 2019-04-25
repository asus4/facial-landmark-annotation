<template lang="pug">
.home
  Menu
  LandmarkEditor
  .columns
    .column.is-full
      input.slider(ref="timeSlider" type="range" value="0" min="0" :max="total" @change="onTimeSliderChange")
  .columns
    .column
      // Frame Incrementer
      span Frame:
      button.button(@click="decrement")
        b-icon(icon="minus")
      span &nbsp{{ current }} / {{ total }} &nbsp
      button.button(@click="increment")
        b-icon(icon="plus")
    .column
      button.button(@click="autoDetect") Auto Detect
  b-loading(:active.sync="isLoading")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'
import * as faceapi from 'face-api.js'

console.log(faceapi)

@Component({
  components: {
    LandmarkEditor,
    Menu,
  },
})
export default class Home extends Vue {

  private isLoading = true

  public $refs!: {
    timeSlider: HTMLInputElement;
  }

  private async mounted() {
    // TODO put in local
    const modelpath = 'https://justadudewhohacks.github.io/face-api.js/models'
    await faceapi.loadSsdMobilenetv1Model(modelpath)
    this.isLoading = false
  }

  private get current(): number {
    return AppModule.currentFrame
  }

  private get total(): number {
    return AppModule.totalFrame
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
.slider
  width: 100%
</style>
