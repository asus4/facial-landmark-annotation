
<template lang="pug">
.timeline
  svg.scroller(:viewBox="svgViewBox" :style="svgStyle")
    //- Bar
    g(:transform="`translate(${getPosX(current)}, 0)`")
      line.current-position(x1="0" y1="0" x2="0" :y2="frameHeight + labelHeight")
      text.current-position-label(x="1" :y="labelHeight - 2") {{ current }}
    //- Frames
    g(
      v-for="(faces, index) in frames"
      :transform="`translate(${getPosX(index)}, ${labelHeight})`"
      @click="() => current = index"
    )
      rect.frame(x="0" y="0" :width="frameWidth - 1" :height="frameHeight")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule, IFace } from '@/store/modules/timeline'

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
  }

  private labelHeight = 12
  private frameWidth = 5
  private frameHeight = 15

  private get current(): number { return AppModule.currentFrame }
  private set current(n: number) { AppModule.setCurrentFrame(n) }

  private get total(): number { return Math.ceil(AppModule.totalFrame) }

  private get frames(): IFace[][] { return TimelineModule.frames }

  private get svgViewBox(): string { return `0 0 ${this.getPosX(this.total)} ${this.frameHeight + 20}` }
  private get svgStyle() {
    return {
      width: this.getPosX(this.total) + 'px',
      height: this.frameHeight + 40 + 'px',
    }
  }

  private getPosX(i: number) {
    return i * this.frameWidth
  }
}
</script>

<style lang="sass" scoped>

$color: #8c67ef
$barColor: #ff0000

.timeline
  position: relative
  width: 100%
  overflow-x: scroll

.current-position
  stroke: $barColor

.current-position-label
  font: 12px sans-serif
  fill: $barColor

.frame
  fill: $color
  &:hover
    opacity: 0.5

</style>
