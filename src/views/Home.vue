<template lang="pug">
.home
  button(@click="decrement") -
  span {{ count }}
  button(@click="increment") +
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  components: {},
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
