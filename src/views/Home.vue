<template lang="pug">
.home
  Menu
  .editor
    LandmarkEditor.landmark-editor
    DetailTable.detail-table
  Controls
  Timeline
  b-loading(:active.sync="isLoading")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as faceapi from 'face-api.js'
import { AppModule } from '@/store/modules/app'
import Controls from '@/components/Controls.vue'
import DetailTable from '@/components/DetailTable.vue'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'
import Timeline from '@/components/Timeline.vue'

@Component({
  components: {
    Controls,
    DetailTable,
    LandmarkEditor,
    Menu,
    Timeline,
  },
})
export default class Home extends Vue {

  private isLoading = true

  private async mounted() {
    // Load models
    // const modelpath = 'https://justadudewhohacks.github.io/face-api.js/models'
    const modelpath = 'models'
    // await faceapi.loadSsdMobilenetv1Model(modelpath)
    await faceapi.loadTinyFaceDetectorModel(modelpath)
    await faceapi.loadFaceLandmarkModel(modelpath)
    this.isLoading = false
  }
}
</script>

<style lang="sass" scoped>

$tableWidth: 250px

.editor
  position: relative
  display: flex
  width: 100%
.landmark-editor
  width: calc(100% - #{$tableWidth})
.detail-table
  width: $tableWidth
</style>
