<template lang="pug">
.home
  Menu
  LandmarkEditor
  Timeline
  b-loading(:active.sync="isLoading")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'
import Timeline from '@/components/Timeline.vue'
import * as faceapi from 'face-api.js'

@Component({
  components: {
    LandmarkEditor,
    Menu,
    Timeline,
  },
})
export default class Home extends Vue {

  private isLoading = true

  private async mounted() {
    // Load models
    // TODO put in local
    const modelpath = 'https://justadudewhohacks.github.io/face-api.js/models'
    // await faceapi.loadSsdMobilenetv1Model(modelpath)
    await faceapi.loadTinyFaceDetectorModel(modelpath)
    await faceapi.loadFaceLandmarkModel(modelpath)
    this.isLoading = false
  }
}
</script>

<style lang="sass" scoped>
</style>
