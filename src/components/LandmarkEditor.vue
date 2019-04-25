<template lang="pug">
.editor.is-full
  video.video(
    ref="video" muted
    :src="videoUrl"
    :current-time.prop="currentTime"
    @loadeddata="onVideoLoaded"
    @seeked="onVideoSeeked"
  )
  svg.overlay(ref="svg" :viewBox="svgViewBox")
    circle(v-for="{x, y} in landmaks" :cx="x" :cy="y" r="4" draggable="true")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import * as faceapi from 'face-api.js'

@Component({
  components: {},
})
export default class LandmarkEditor extends Vue {

  public $refs!: {
    video: HTMLVideoElement;
    svg: SVGElement
  }

  private svgViewBox = '0 0 1280 720'
  private landmaks: faceapi.IPoint[] = []
  private options = new faceapi.TinyFaceDetectorOptions()

  private get video() {
    return this.$refs.video
  }

  private get videoUrl(): string {
    return AppModule.videoUrl
  }

  private get currentTime() {
    return AppModule.currentTime
  }

  private onVideoLoaded() {
    this.svgViewBox = `0 0 ${this.video.videoWidth} ${this.video.videoHeight}`

    AppModule.setVideoDuration(this.video.duration)
  }

  private async onVideoSeeked() {
    const detections = await faceapi.detectAllFaces(this.video, this.options).withFaceLandmarks()
    if (detections.length <= 0) {
      this.landmaks = []
      return
    }
    const svg = this.$refs.svg
    const bbox = svg.getBoundingClientRect()
    const resized = faceapi.resizeResults(detections, { width: bbox.width, height: bbox.height })

    this.landmaks = detections[0].landmarks.positions
  }
}
</script>

<style lang="sass" scoped>
.editor
  position: relative

.overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

svg
  circle
    stroke: #00ff00
    fill: none
    cursor: grab
    &:hover
      stroke: none
      fill: #00ff00
    &:active
      cursor: grabbing
</style>
