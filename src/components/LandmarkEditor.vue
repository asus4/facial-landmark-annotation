<template lang="pug">
.editor.is-full
  .scaler(:style="{ width: resolution.width+'px', height: resolution.height+'px' }")
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule, IFace } from '@/store/modules/timeline'
import * as faceapi from 'face-api.js'
import LandmarkEditorFace from './LandmarkEditorFace.vue'

@Component({
  components: { LandmarkEditorFace },
})
export default class LandmarkEditor extends Vue {

  public $refs!: {
    video: HTMLVideoElement;
    svg: SVGElement
  }

  private faces: IFace[] = []
  private options = new faceapi.TinyFaceDetectorOptions()
  private svgViewBox = '0 0 1280 720'
  private resolution: faceapi.IDimensions = new faceapi.Dimensions(0, 0)

  private get video() {
    return this.$refs.video
  }

  private get videoUrl(): string {
    return AppModule.videoUrl
  }

  private get currentTime() {
    return AppModule.currentTime
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
  }

  private async detectFace() {
    const frame = AppModule.currentFrame

    const cache = TimelineModule.frames[frame]
    if (cache && cache.length > 0) {
      console.log('already detected')
      this.faces = cache
      return
    }
    const detections = await faceapi.detectAllFaces(this.video, this.options).withFaceLandmarks()

    this.faces = detections.map((d, i) => {
      return {
        id: i,
        rect: d.alignedRect.box,
        landmarks: d.landmarks.positions,
      }
    })
    TimelineModule.updateFrame({frame, faces: this.faces})
  }
}
</script>

<style lang="sass" scoped>
.editor
  position: relative

.scaler
  position: relative

.overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
</style>
