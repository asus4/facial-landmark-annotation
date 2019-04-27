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
      svg.overlay(ref="svg" :viewBox="svgViewBox")
        LandmarkEditorFace(
          v-for="(face, index) in faces"
          :face="face"
          :key="index"
          :rootSvg="$refs.svg"
        )
  .zoom-ui
    b-tooltip(label="Zoom Out (z)" type="is-light" position="is-right")
      button.button(@click="zoomOut")
        b-icon(icon="magnify-minus")
    b-tooltip(label="Zoom In (x)" type="is-light" position="is-right")
      button.button(@click="zoomIn")
        b-icon(icon="magnify-plus")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule, IFace } from '@/store/modules/timeline'
import * as faceapi from 'face-api.js'
import LandmarkEditorFace from './LandmarkEditorFace.vue'
import hotkeys from 'hotkeys-js'
import { toIRect, toIPoint } from '@/utils/faceapi'

@Component({
  components: { LandmarkEditorFace },
})
export default class LandmarkEditor extends Vue {

  public $refs!: {
    video: HTMLVideoElement;
    svg: SVGElement
  }

  private faces: IFace[] = []

  // TODO: change landmark options from UI
  private options = new faceapi.TinyFaceDetectorOptions()
  private svgViewBox = '0 0 1280 720'
  private resolution: faceapi.IDimensions = new faceapi.Dimensions(0, 0)
  private zoom = 1

  private mounted() {
    hotkeys('z', this.zoomOut)
    hotkeys('x', this.zoomIn)
  }

  private destroyed() {
    hotkeys.unbind('z')
    hotkeys.unbind('x')
  }

  private get video() {
    return this.$refs.video
  }

  private get videoUrl(): string {
    return AppModule.videoUrl
  }

  private get currentTime() {
    return AppModule.currentTime
  }

  private get scalerStyle() {
    return {
      width: this.resolution.width + 'px',
      height: this.resolution.height + 'px',
      transform: `scale(${this.zoom})`,
    }
  }

  private get isAutoProcess(): boolean {
    return AppModule.isAutoProcess
  }

  @Watch('isAutoProcess')
  private onAutoProcessChanged(value: boolean) {
    if (value) {
      // Start from next blank frame
      AppModule.nextBlankFrame()
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

    await this.detectFace()
  }

  private async onVideoSeeked() {
    await this.detectFace()
    if (this.isAutoProcess) {
      AppModule.nextFrame()
    }
  }

  private zoomIn() {
    this.zoom *= 3 / 2
  }

  private zoomOut() {
    this.zoom *= 2 / 3
  }

  private async detectFace() {
    const frame = AppModule.currentFrame

    const cache = TimelineModule.frames[frame]
    if (cache) {
      console.log('use cache')
      this.faces = cache
      return
    }
    const detections = await faceapi.detectAllFaces(this.video, this.options).withFaceLandmarks()

    this.faces = detections.map((d, i) => {
      return {
        id: i,
        rect: toIRect(d.alignedRect.box),
        landmarks: d.landmarks.positions.map((p) => toIPoint(p)),
      }
    })
    TimelineModule.updateFrame({frame, faces: this.faces})
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
</style>
