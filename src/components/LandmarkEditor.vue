<template lang="pug">
.wrapper
  .editor
    .scaler(:style="scalerStyle")
      video(
        ref="video" muted
        :src="videoUrl"
        :current-time.prop="currentTime"
        @loadeddata="onVideoLoaded"
        @seeked="onVideoSeeked"
      )
      svg.overlay(ref="svg" :viewBox="svgViewBox"
        @mousedown="onSvgMouseDown"
        @mousemove="onSvgMouseMove"
        @mouseup="onSvgMouseUp"
        @mouseleave="onSvgMouseLeave"
      )
        LandmarkEditorFace(
          v-for="(face, index) in faces"
          :face="face"
          :key="index"
          :rootSvg="$refs.svg"
        )
        rect.newrect(v-if="newFaceRect.width > 0"
          :x="newFaceRect.x" :y="newFaceRect.y" :width="newFaceRect.width" :height="newFaceRect.height"
        )
  .zoom-ui
    b-tooltip(label="Zoom Out (z)" type="is-light" position="is-right")
      button.button(@click="zoomOut" v-shortkey="['z']" @shortkey="zoomOut")
        b-icon(icon="magnify-minus")
    b-tooltip(label="Zoom In (x)" type="is-light" position="is-right")
      button.button(@click="zoomIn" v-shortkey="['x']" @shortkey="zoomIn")
        b-icon(icon="magnify-plus")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { createCanvas, getContext2dOrThrow } from 'tfjs-image-recognition-base'
import { AppModule } from '@/store/modules/app'
import { TimelineModule } from '@/store/modules/timeline'
import { IFace } from '@/store/types'
import * as faceapi from 'face-api.js'
import LandmarkEditorFace from './LandmarkEditorFace.vue'
import { toIRect, toIPoint } from '@/utils/faceapi'

@Component({
  components: { LandmarkEditorFace },
})
export default class LandmarkEditor extends Vue {

  public $refs!: {
    video: HTMLVideoElement;
    svg: SVGGraphicsElement
  }

  private svgViewBox = '0 0 1280 720'
  private resolution: faceapi.IDimensions = new faceapi.Dimensions(0, 0)
  private zoom = 1
  private svgPoint!: SVGPoint
  private svgDownPoint = new faceapi.Point(-1, -1)
  private newFaceRect = new faceapi.Rect(0, 0, 0, 0)

  private get faces() { return TimelineModule.frames[AppModule.currentFrame] }

  private get video() { return this.$refs.video }
  private get videoUrl(): string { return AppModule.videoUrl }

  private get currentTime() { return AppModule.currentTime }
  private get isAutoProcess(): boolean { return AppModule.isAutoProcess }

  private get options() { return AppModule.faceDetectorOptions }
  private get forceDetect(): boolean { return AppModule.forceDetect }

  private get scalerStyle() {
    return {
      width: this.resolution.width + 'px',
      height: this.resolution.height + 'px',
      transform: `scale(${this.zoom})`,
    }
  }

  private mounted() {
    this.svgPoint = (this.$refs.svg as any).createSVGPoint()
  }

  @Watch('isAutoProcess')
  private onAutoProcessChanged(value: boolean) {
    if (value) {
      // Start from next blank frame
      AppModule.nextBlankFrame()
    }
  }

  @Watch('forceDetect')
  private async onForceDetectChanged(value: boolean) {
    if (value) {
      await this.detectFace(false)
      AppModule.setForceDetect(false)
    }
  }

  private async onVideoLoaded() {
    this.svgViewBox = `0 0 ${this.video.videoWidth} ${this.video.videoHeight}`
    this.resolution = new faceapi.Dimensions(this.video.videoWidth, this.video.videoHeight)

    AppModule.setVideoDuration(this.video.duration)
    TimelineModule.setMetaData({
      duration: this.video.duration,
      frames: AppModule.totalFrame,
      width: this.video.videoWidth,
      height: this.video.videoHeight,
    })

    await this.detectFace(true)
  }

  private async onVideoSeeked() {
    await this.detectFace(true)
    if (this.isAutoProcess) {
      AppModule.nextFrame()
    }
  }

  private onSvgMouseDown(e: MouseEvent) {
    e.preventDefault()
    if (e.srcElement === this.$refs.svg) {
      AppModule.selectFace(null) // unselect
      this.svgDownPoint = this.getTransformedPoint(e.clientX, e.clientY)
    }
  }

  private onSvgMouseMove(e: MouseEvent) {
    e.preventDefault()
    if (this.svgDownPoint.x < 0) {
      return
    }
    // make new rect area
    const a = this.getTransformedPoint(e.clientX, e.clientY)
    const b = this.svgDownPoint
    const tl = new faceapi.Point(Math.min(a.x, b.x), Math.min(a.y, b.y))
    const br = new faceapi.Point(Math.max(a.x, b.x), Math.max(a.y, b.y))
    this.newFaceRect = new faceapi.Rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y)
  }

  private async onSvgMouseUp(e: MouseEvent) {
    e.preventDefault()
    if (this.newFaceRect.width > 10 && this.newFaceRect.height > 10) {
      await this.createNewFace(this.newFaceRect)
    }
    this.svgDownPoint = new faceapi.Point(-1, -1)
    this.newFaceRect = new faceapi.Rect(0, 0, 0, 0)
  }

  private async onSvgMouseLeave(e: MouseEvent) {
    e.preventDefault()
    this.svgDownPoint = new faceapi.Point(-1, -1)
    this.newFaceRect = new faceapi.Rect(0, 0, 0, 0)
  }

  private async createNewFace(rect: faceapi.Rect) {
    // detect landmarks from rect
    const input = createCanvas({width: rect.width, height: rect.height})
    getContext2dOrThrow(input).drawImage(this.video,
      rect.x, rect.y, rect.width, rect.height,
      0, 0, rect.width, rect.height)
    const landmarks = await faceapi.detectFaceLandmarks(input) as faceapi.FaceLandmarks68

    // add new face
    const face: IFace = {
      id: 0,
      rect: toIRect(rect),
      landmarks: landmarks.positions.map((p) => {
        return {
          x: p.x + rect.x,
          y: p.y + rect.y,
        }
      }),
    }
    AppModule.addFace(face)
  }

  private zoomIn() {
    this.zoom *= 3 / 2
  }

  private zoomOut() {
    this.zoom *= 2 / 3
  }

  private async detectFace(useCache: boolean) {
    const frame = AppModule.currentFrame

    if (useCache && this.faces) {
      console.log('use cache')
      return
    }

    const detections = await faceapi.detectAllFaces(this.video, this.options).withFaceLandmarks()

    const faces = detections.map((d, i) => {
      return {
        id: i,
        rect: toIRect(d.alignedRect.box),
        landmarks: d.landmarks.positions.map((p) => toIPoint(p)),
      }
    })
    TimelineModule.updateFrame({ frame, faces })
  }

  private getTransformedPoint(x: number, y: number): faceapi.Point {
    this.svgPoint.x = x
    this.svgPoint.y = y
    const p = this.svgPoint.matrixTransform(this.$refs.svg.getScreenCTM()!.inverse())
    return new faceapi.Point(p.x, p.y)
  }


}
</script>

<style lang="sass" scoped>
.wrapper
  position: relative

.editor
  position: relative
  width: 100%
  height: 70vh
  overflow: auto

.scaler
  position: relative
  transform-origin: top left

.overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.zoom-ui
  position: absolute
  bottom: 0
  left: 0

.newrect
  stroke: #ff0000
  stroke-width: 3
  fill: none
</style>
