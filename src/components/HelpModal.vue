<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title Help
  section.modal-card-body
    h2.is-size-5 Keyboard Shortcuts
    table.table.is-bordered.is-striped
      thead
        tr
          th Command
          th Key
      tbody
        tr(v-for="cols in shortcuts")
          td {{ cols[0] }}
          td {{ cols[1] }}
  footer.modal-card-foot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class HelpModal extends Vue {

  public shortcuts: string[][] = [
    [ 'Next Frame', '.' ],
    [ 'Prev Frame', ',' ],
    [ 'Zoom In', 'x' ],
    [ 'Zoom Out', 'z' ],
    [ 'Copy', 'ctrl + c' ],
    [ 'Paste', 'ctrl + v' ],
    [ 'Delete', 'backspace'],
  ]
}
</script>

<style lang="sass" scoped>

</style>
