<template lang="pug">
.home
  Menu
  LandmarkEditor
  .columns
    .column.is-one-third
      // Frame Incrementer
      button.button(@click="decrement")
        b-icon(icon="minus")
      span {{ count }}
      button.button(@click="increment")
        b-icon(icon="plus")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import LandmarkEditor from '@/components/LandmarkEditor.vue'
import Menu from '@/components/Menu.vue'

@Component({
  components: {
    LandmarkEditor,
    Menu,
  },
})
export default class Home extends Vue {

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
