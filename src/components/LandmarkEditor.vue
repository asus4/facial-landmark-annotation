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
    LandmarkEditorFace(v-for="landmarks in faces" :landmarks="landmarks")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
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

  private svgViewBox = '0 0 1280 720'
  private faces: faceapi.IPoint[][] = []
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
    this.faces = detections.map((d) => d.landmarks.positions)
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
</style>
