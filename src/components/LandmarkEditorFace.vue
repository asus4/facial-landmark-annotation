<template lang="pug">
g
  path.svg-stroke(:d="allPath" :stroke-width="2 / zoom" )
  rect.rect.svg-stroke(
    :x="rect.x" :y="rect.y" :width="rect.width" :height="rect.height"
    @mousedown="onRectMouseDown"
    @mousemove="onRectMouseMove"
    @mouseup="onRectMouseUp"
    :style="{ strokeWidth: isSelectedFace ? 3 : 1}"
  )
  text(:x="rect.x" :y="rect.y - 2") ID: {{ face.id }}
  circle(
    v-for="(p, index) in positions"
    :r="6 / zoom" :stroke-width="4 / zoom"
    draggable="true"
    :cx="p.x" :cy="p.y" :key="index"
    @mousedown="(e) => onCircleMouseDown(e, index)"
    @mousemove="(e) => onCircleMouseMove(e, index)"
    @mouseup="(e) => onCircleMouseUp(e, index)"
    @mouseleave="(e) => onCircleMouseUp(e, index)"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule } from '@/store/modules/timeline'
import { IFace } from '@/store/types'
import * as faceapi from 'face-api.js'
import { deepCloneFace } from '@/utils/editor'

@Component({
  components: {},
})
export default class LandmarkEditorFace extends Vue {

  @Prop({ default: null })
  public face!: IFace

  @Prop({ default: null })
  public rootSvg!: SVGGraphicsElement

  @Prop({ default: 1.0 })
  public zoom!: number

  private svgPoint!: SVGPoint
  private selectedPoint = -1
  private rectMouseDown: faceapi.Point = new faceapi.Point(-1, -1)
  private faceMouseDown: IFace = this.face

  private mounted() {
    this.svgPoint = (this.rootSvg as any).createSVGPoint()
  }

  private get positions(): faceapi.IPoint[] {
    return this.face.landmarks
  }

  private get rect(): faceapi.IRect {
    return this.face.rect
  }

  private get isSelectedFace(): boolean {
    return this.face === AppModule.faceSelected
  }

  private onRectMouseDown(e: MouseEvent) {
    e.preventDefault()
    AppModule.selectFace(this.face)
    // this.rectMouseDown = new faceapi.Point(e.clientX, e.clientY)
    this.rectMouseDown = this.getTransformedPoint(e.clientX, e.clientY)
    this.faceMouseDown = deepCloneFace(this.face)
  }

  private onRectMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (this.rectMouseDown.x < 0) {
      return // only dragging
    }

    const current = this.getTransformedPoint(e.clientX, e.clientY)
    const diff = current.sub(this.rectMouseDown)

    // Move rect
    this.face.rect.x = this.faceMouseDown.rect.x + diff.x
    this.face.rect.y = this.faceMouseDown.rect.y + diff.y
    // Move all landmakrs
    this.face.landmarks = this.face.landmarks.map((p, i) => {
      const origin = this.faceMouseDown.landmarks[i]
      return {
        x: origin.x + diff.x,
        y: origin.y + diff.y,
      }
    })
  }

  private onRectMouseUp(e: MouseEvent) {
    this.rectMouseDown = new faceapi.Point(-1, -1)
  }

  private onCircleMouseDown(e: MouseEvent, index: number) {
    e.preventDefault()
    this.selectedPoint = index
  }

  private onCircleMouseMove(e: MouseEvent, index: number) {
    e.preventDefault()
    if (this.selectedPoint === index) {
      this.updatePoint(index, this.getTransformedPoint(e.clientX, e.clientY))
    }
  }

  private onCircleMouseUp(e: MouseEvent, index: number) {
    e.preventDefault()
    if (this.selectedPoint === index) {
      this.updatePoint(index, this.getTransformedPoint(e.clientX, e.clientY))
    }
    this.selectedPoint = -1
  }


  private updatePoint(index: number, p: faceapi.Point) {
    Vue.set(this.positions, index, {
      x: p.x,
      y: p.y,
    })
  }

  private getTransformedPoint(x: number, y: number): faceapi.Point {
    this.svgPoint.x = x
    this.svgPoint.y = y
    const p = this.svgPoint.matrixTransform(this.rootSvg.getScreenCTM()!.inverse())
    return new faceapi.Point(p.x, p.y)
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

.rect
  fill: rgba(0, 0, 0, 0)

</style>
