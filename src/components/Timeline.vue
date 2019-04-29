
<template lang="pug">
.timeline
  svg.scroller(:viewBox="svgViewBox" :style="svgStyle")
    line.current-position(
      :x1="getPosX(current)"
      y1="0"
      :x2="getPosX(current)"
      :y2="frameHeight"
    )
    g(
      v-for="(faces, index) in frames"
      :transform="`translate(${getPosX(index)}, 0)`"
      @click="() => onFrameClick(index)"
    )
      rect.frame(x="0" y="0" :width="frameWidth - 1" :height="frameHeight")
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

  private frameWidth = 5
  private frameHeight = 15

  private get current(): number { return AppModule.currentFrame }
  private set current(n: number) { AppModule.setCurrentFrame(n) }

  private get total(): number { return Math.ceil(AppModule.totalFrame) }

  private get frames(): IFace[][] { return TimelineModule.frames }

  private get svgViewBox(): string { return `0 0 ${this.getPosX(this.total)} ${this.frameHeight}` }
  private get svgStyle() {
    return {
      width: this.getPosX(this.total) + 'px',
      height: this.frameHeight + 20 + 'px',
    }
  }

  private getPosX(i: number) {
    return i * this.frameWidth
  }

  private onFrameClick(index: number) {
    AppModule.setCurrentFrame(index)
  }
}
</script>

<style lang="sass" scoped>

$color: #8c67ef

.timeline
  position: relative
  width: 100%
  overflow-x: scroll

.current-position
  stroke: #ff0000

.frame
  fill: $color
  &:hover
    opacity: 0.5

</style>
