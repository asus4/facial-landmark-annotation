
<template lang="pug">
b-table.detail-table(
  :data="currentData"
  :columns="columns"
  striped
  draggable
  @dragstart="dragstart"
  @drop="drop"
  @dragover="dragover"
  @dragleave="dragleave"
)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { TimelineModule } from '@/store/modules/timeline'
import { IFace } from '@/store/types'
import * as faceapi from 'face-api.js'

interface Payload {
  event: DragEvent,
  index: number,
  row: IFace
}

@Component({
  components: {},
})
export default class DetailTable extends Vue {
  private columns = [
    { field: 'id', label: 'ID', width: '40', numeric: true },
    { field: 'rect.x', label: 'X', width: '40', numeric: true },
    { field: 'rect.y', label: 'Y', width: '40', numeric: true },
    { field: 'rect.width', label: 'W', width: '40', numeric: true },
    { field: 'rect.height', label: 'H', width: '40', numeric: true },
  ]

  private draggingRow!: IFace
  private draggingRowIndex = -1

  private get currentData(): IFace[] {
    const frame = TimelineModule.frames[AppModule.currentFrame]
    if (frame) {
      return frame
    }
    return []
  }

  private dragstart(payload: Payload) {
    this.draggingRow = payload.row
    this.draggingRowIndex = payload.index
    payload.event.dataTransfer!.effectAllowed = 'copy'
  }

  private dragover(payload: Payload) {
    payload.event.dataTransfer!.dropEffect = 'copy'
    this.setSelected(payload.event.target, true)
    payload.event.preventDefault()
  }

  private dragleave(payload: Payload) {
    this.setSelected(payload.event.target, false)
    payload.event.preventDefault()
  }

  private drop(payload: Payload) {
    this.setSelected(payload.event.target, false)
    const droppedOn = payload.index

    this.swapFaceIndex(this.draggingRowIndex, droppedOn)
  }

  private swapFaceIndex(a: number, b: number) {
    const frames = this.currentData
    const tmp = frames[a]
    const tmpId = tmp.id

    frames[a].id = frames[b].id
    frames[b].id = tmpId

    Vue.set(frames, a, frames[b])
    Vue.set(frames, b, tmp)
  }

  private setSelected(target: any, selected: boolean) {
    if (selected) {
      target.closest('tr').classList.add('is-selected')
    } else {
      target.closest('tr').classList.remove('is-selected')
    }
  }
}
</script>

<style lang="sass" scoped>
.detail-table
  position: relative


</style>
