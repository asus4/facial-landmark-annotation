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
  // for file loading
  input(ref="input" type="file" @change="onLoadFile")
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

  public $refs!: {
    input: HTMLInputElement;
  }

  private folders: MenuFolder[] = [
    {
      name: 'File',
      items: [
        {
          name: 'Load Video',
          method: this.loadVideo,
          keymap: 'ctrl+o',
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
      ],
    },
    {
      name: 'Edit',
      items: [
        {
          name: 'Undo',
          method: this.undo,
          keymap: 'ctrl+z',
        },
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
    {
      name: 'Help',
      items: [
        {
          name: 'Show Help',
          method: this.showHelp,
        },
      ],
    },
  ]

  private mounted() {
    // Assign all keymaps
    for (const folder of this.folders) {
      for (const item of folder.items) {
        if (item.keymap) {
          hotkeys(item.keymap, (e: Event) => {
            e.preventDefault()
            item.method()
          })
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
    this.$dialog.confirm({
      message: 'Are you saved?',
      onConfirm: () =>  {
        const input = this.$refs.input
        input.accept = 'video/*'
        input.click()
      }
    })
  }

  private loadJson() {
    console.log('loadJson')
  }

  private saveJson() {
    console.log('saveJson')
  }

  private undo() {
    console.log('undo')
  }

  private showHelp() {
    console.log('show help')
  }

  private onLoadFile(e: Event) {
    const input = this.$refs.input
    if (!input.files || input.files.length === 0) {
      return
    }
    const file = input.files[0]
    AppModule.loadVideo(file)
  }
}
</script>

<style lang="sass" scoped>
input
  display: none
</style>
