<template lang="pug">
.editor.is-full
  video.video(
    ref="video" muted
    :src="videoUrl"
    :current-time.prop="currentTime"
    @loadeddata="onVideoLoaded"
    @seeked="onVideoSeeked"
  )
  svg.overlay
    circle(v-for="{x, y} in landmaks" :cx="x" :cy="y" r="4")
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
  }

  private landmaks: faceapi.IPoint[] = []

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
    AppModule.setVideoDuration(this.video.duration)
  }

  private async onVideoSeeked() {
    const detections = await faceapi.detectAllFaces(this.video).withFaceLandmarks()
    if (detections.length <= 0) {
      console.log('face not found')
      this.landmaks = []
      return
    }
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
    &:hover
      fill: #00ff00
</style>
