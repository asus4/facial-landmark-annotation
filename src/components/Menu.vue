<template lang="pug">
nav.navbar(role="navigation" aria-label="main navigation")
  .navbar-brand
    .navbar-item Landmark Editor
    .navbar-start
      .navbar-item.has-dropdown.is-hoverable(v-for="{name, items} in folders")
        .navbar-link {{ name }}
        .navbar-dropdown
          a.navbar-item(v-for="item in items" @click="item.method") {{ item.name }}
            span(v-if="item.keymap") &nbsp({{ item.keymap }})
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import hotkeys from 'hotkeys-js'

interface MenuItem {
  name: string,
  method: () => void,
  keymap?: string
}

interface MenuFolder {
  name: string,
  items: MenuItem[]
}

@Component({
  components: {},
})
export default class Menu extends Vue {

  private folders: MenuFolder[] = [
    {
      name: 'File',
      items: [
        {
          name: 'Load Video',
          method: this.loadVideo,
          keymap: 'ctrl+o'
        },
        {
          name: 'Load Json',
          method: this.loadJson,
        },
        {
          name: 'Save Json',
          method: this.saveJson,
          keymap: 'ctrl+s',
        },
      ]
    },
    {
      name: 'Edit',
      items: [
        {
          name: 'Next Frame',
          method: AppModule.nextFrame,
          keymap: '.',
        },
        {
          name: 'Prev Frame',
          method: AppModule.prevFrame,
          keymap: ',',
        },
      ],
    },
  ]

  private keymaps: { [id: string]: () => void } = {
    'ctrl+o': this.loadVideo,
    'ctrl+s': this.saveJson,
    '.': this.nextFrame,
    ',': this.prevFrame,
  }

  private mounted() {
    // Assign all keymaps
    for (const folder of this.folders) {
      for (const item of folder.items) {
        if (item.keymap) {
          hotkeys(item.keymap, item.method)
        }
      }
    }
  }

  private destroyed() {
    // Remove all key maps
    for (const folder of this.folders) {
      for (const item of folder.items) {
        if (item.keymap) {
          hotkeys.unbind(item.keymap)
        }
      }
    }
  }

  private loadVideo() {
    console.log('loadVideo')
  }

  private loadJson() {
    console.log('loadJson')
  }

  private saveJson() {
    console.log('saveJson')
  }
}
</script>
