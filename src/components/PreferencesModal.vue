<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title Preferences
  section.modal-card-body
    h2.is-size-5 Setting

  footer.modal-card-foot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class PreferencesModal extends Vue {

}
</script>

<style lang="sass" scoped>

</style>
