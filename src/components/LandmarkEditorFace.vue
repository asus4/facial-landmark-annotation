<template lang="pug">
g
  path(:d="allPath")
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class LandmarkEditorFace extends Vue {

  @Prop({ default: [] })
  public landmarks!: faceapi.FaceLandmarks68

  @Prop({ default: null })
  public rootSvg!: SVGGraphicsElement

  private svgPoint!: SVGPoint
  private selected = -1

  private mounted() {
    this.svgPoint = (this.rootSvg as any).createSVGPoint()
  }

  private get positions(): faceapi.IPoint[] {
    return this.landmarks.positions
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
    path += this.pointToPath(this.landmarks.getJawOutline(), false)
    path += this.pointToPath(this.landmarks.getLeftEyeBrow(), false)
    path += this.pointToPath(this.landmarks.getRightEyeBrow(), false)
    path += this.pointToPath(this.landmarks.getNose(), false)
    path += this.pointToPath(this.landmarks.getLeftEye(), true)
    path += this.pointToPath(this.landmarks.getRightEye(), true)
    path += this.pointToPath(this.landmarks.getMouth(), true)
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
circle
  stroke: #00ff00
  fill: none
  cursor: grab
  &:hover
    stroke: none
    fill: #00ff00
  &:active
    cursor: grabbing

path
  stroke: #00ff00
  stroke-width: 1
  fill: none
</style>
