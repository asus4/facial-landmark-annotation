<template lang="pug">
.editor.is-full
  video.video(
    ref="video" muted
    :src="videoUrl"
    :current-time.prop="currentTime"
    @loadeddata="onVideoLoaded"
    @seeked="onVideoSeeked"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  components: {},
})
export default class LandmarkEditor extends Vue {

  public $refs!: {
    video: HTMLVideoElement;
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

  private onVideoLoaded() {
    AppModule.setVideoDuration(this.video.duration)
  }

  private onVideoSeeked() {
    console.log('seeked!', this.video.currentTime)
  }
}
</script>
