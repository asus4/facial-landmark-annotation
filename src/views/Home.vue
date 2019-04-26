<template lang="pug">
.home
  Menu
  LandmarkEditor
  Controls
  b-loading(:active.sync="isLoading")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as faceapi from 'face-api.js'
import { AppModule } from '@/store/modules/app'
import Controls from '@/components/Controls.vue'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'

@Component({
  components: {
    Controls,
    LandmarkEditor,
    Menu,
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
