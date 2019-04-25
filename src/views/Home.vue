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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'

@Component({
  components: {
    LandmarkEditor,
    Menu,
  },
})
export default class Home extends Vue {

  public $refs!: {
    timeSlider: HTMLInputElement;
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
