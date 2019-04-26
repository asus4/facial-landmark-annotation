<template lang="pug">
g
  path.svg-stroke(:d="allPath")
  rect.svg-stroke(:x="rect.x" :y="rect.y" :width="rect.width" :height="rect.height")
  text(:x="rect.x" :y="rect.y - 2") ID: {{ face.id }}
  circle(
    v-for="(p, index) in positions"
    r="4" draggable="true"
    :cx="p.x" :cy="p.y" :key="index"
    @mousedown="(e) => onMouseDown(e, index)"
    @mousemove="(e) => onMouseMove(e, index)"
    @mouseup="(e) => onMouseUp(e, index)"
    @mouseleave="(e) => onMouseUp(e, index)"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule, IFace } from '@/store/modules/timeline'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class LandmarkEditorFace extends Vue {

  @Prop({ default: null })
  public face!: IFace

  @Prop({ default: null })
  public rootSvg!: SVGGraphicsElement

  private svgPoint!: SVGPoint
  private selected = -1

  private mounted() {
    this.svgPoint = (this.rootSvg as any).createSVGPoint()
  }

  private get positions(): faceapi.IPoint[] {
    return this.face.landmarks
  }

  private get rect(): faceapi.IRect {
    return this.face.rect
  }

  private onMouseDown(e: MouseEvent, index: number) {
    this.selected = index
  }

  private onMouseMove(e: MouseEvent, index: number) {
    if (this.selected === index) {
      this.updatePoint(e, index)
    }
  }

  private onMouseUp(e: MouseEvent, index: number) {
    if (this.selected === index) {
      this.updatePoint(e, index)
    }
    this.selected = -1
  }

  private updatePoint(e: MouseEvent, index: number) {
    this.svgPoint.x = e.clientX
    this.svgPoint.y = e.clientY
    const p = this.svgPoint.matrixTransform(this.rootSvg.getScreenCTM()!.inverse())
    Vue.set(this.positions, index, new faceapi.Point(p.x, p.y))
  }

  private get allPath(): string {
    let path = ''
    // https://github.com/justadudewhohacks/face-api.js/blob/master/src/classes/FaceLandmarks68.ts
    path += this.pointToPath(this.face.landmarks.slice(0, 17), false) // getJawOutline
    path += this.pointToPath(this.face.landmarks.slice(17, 22), false) // getLeftEyeBrow
    path += this.pointToPath(this.face.landmarks.slice(22, 27), false) // getRightEyeBrow
    path += this.pointToPath(this.face.landmarks.slice(27, 36), false) // getNose
    path += this.pointToPath(this.face.landmarks.slice(36, 42), true) // getLeftEye
    path += this.pointToPath(this.face.landmarks.slice(42, 48), true) // getRightEye
    path += this.pointToPath(this.face.landmarks.slice(48, 68), true) // getMouth
    return path
  }

  private pointToPath(points: faceapi.IPoint[], close: boolean): string {
    let path = ''

    points.forEach((p, i) => {
      if (i === 0) {
        path += `M${p.x} ${p.y} `
      } else {
        path += `L${p.x} ${p.y} `
      }
    })
    path += close ? ' Z ' : ' '
    return path
  }

}
</script>

<style lang="sass" scoped>

$color: #00ff00

circle
  stroke: $color
  fill: none
  cursor: grab
  &:hover
    stroke: none
    fill: $color
  &:active
    cursor: grabbing

text
  font: 12px sans-serif
  fill: $color

.svg-stroke
  stroke: $color
  stroke-width: 1
  fill: none
</style>
