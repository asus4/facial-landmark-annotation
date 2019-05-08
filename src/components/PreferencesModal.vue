<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title Preferences
  section.modal-card-body
    b-field(label="Frame Rate:")
      b-numberinput(controls-position="compact"
        v-model="fps"
        min="1" max="60"
      )
  footer.modal-card-foot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  components: {},
})
export default class PreferencesModal extends Vue {

  private get fps(): number { return AppModule.fps }
  private set fps(n: number) { AppModule.setFps(n) }
}
</script>

<style lang="sass" scoped>

</style>
