<template lang="pug">
.editor.is-full
  div aaaaaa
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  components: {},
})
export default class LandmarkEditor extends Vue {

  private get count(): number {
    return AppModule.currentFrame
  }

  private increment() {
    AppModule.nextFrame()
  }

  private decrement() {
    AppModule.prevFrame()
  }

}
</script>
