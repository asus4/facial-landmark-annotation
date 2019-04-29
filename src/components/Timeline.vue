
<template lang="pug">
.timeline
  svg.scroller(:viewBox="svgViewBox" :style="svgStyle")
    //- Bar
    g(:transform="`translate(${getPosX(current)}, 0)`")
      line.current-position(x1="0" y1="0" x2="0" :y2="frameHeight + labelHeight")
      text.current-position-label(x="1" :y="labelHeight - 2") {{ current }}
    //- Frame Texts
    g
      text.frame-text(
        v-for="n in labeledFrameCount"
        :x="getPosX(n * labelInterval)" y="0"
      ) {{ n * labelInterval }}
    //- Frames
    g(:transform="`translate(0, ${labelHeight})`")
      rect.frame(v-for="(faces, index) in frames"
        :class="getFrameClass(faces)"
        :x="getPosX(index)" y="0"
        :width="frameWidth - 1" :height="frameHeight"
        @click="() => current = index"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { IFace } from '@/store/types'
import { TimelineModule } from '@/store/modules/timeline'

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


  private frameWidth = 5
  private frameHeight = 15
  private labelHeight = 10
  private labelInterval = 50

  private get current(): number { return AppModule.currentFrame }
  private set current(n: number) { AppModule.setCurrentFrame(n) }

  private get total(): number { return Math.ceil(AppModule.totalFrame) }
  private get labeledFrameCount(): number { return Math.floor(this.total / this.labelInterval) }

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

  private getFrameClass(frame: IFace[]) {
    if (!frame) {
      return 'frame-null'
    }
    const len = frame.length
    if (len === 0) {
      return 'frame-blank'
    }
    if (len === 1) {
      return 'frame-1'
    }
    if (len === 2) {
      return 'frame-2'
    }
    return 'frame-many'
  }
}
</script>

<style lang="sass" scoped>

$barColor: #ff0000

$nullFrameColor: hsl(0, 0%, 71%)
$blankFrameColor: hsl(0, 0%, 48%)
$found1Color: hsl(271, 25%, 71%)
$found2Color: hsl(271, 75%, 71%)
$foundManyColor: hsl(271, 100%, 71%)

.timeline
  position: relative
  width: 100%
  overflow-x: scroll

.current-position
  stroke: $barColor

.current-position-label
  font: 12px sans-serif
  fill: $barColor

.frame-text
  font: 12px sans-serif
  fill: #333333

.frame:hover
    opacity: 0.5
.frame-null
  fill: $nullFrameColor
.frame-blank
  fill: $blankFrameColor
.frame-1
  fill: $found1Color
.frame-2
  fill: $found2Color
.frame-many
  fill: $foundManyColor

</style>
