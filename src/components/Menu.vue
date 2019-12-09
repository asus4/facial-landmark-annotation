<template lang="pug">
nav.navbar(role="navigation" aria-label="main navigation")
  .navbar-brand
    .navbar-item Landmark Editor
    .navbar-start
      .navbar-item.has-dropdown.is-hoverable(v-for="{name, items} in folders")
        .navbar-link {{ name }}
        .navbar-dropdown
          a.navbar-item(v-for="item in items" @click="item.method") {{ item.name }}
            span(
              v-if="item.keymap"
              v-shortkey="item.keymap"
              @shortkey="item.method"
            ) &nbsp ({{ item.keymap.join('+') }})
  // for file loading
  input(ref="input" type="file" @change="onLoadFile")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { saveAs } from 'file-saver'
import { AppModule } from '@/store/modules/app'
import { TimelineModule } from '@/store/modules/timeline'
import HelpModal from '@/components/HelpModal.vue'
import PreferencesModal from '@/components/PreferencesModal.vue'

interface MenuItem {
  name: string,
  method: () => void,
  keymap?: string[]
}

interface MenuFolder {
  name: string,
  items: MenuItem[]
}

@Component({
  components: { },
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
          keymap: ['ctrl', 'o'],
        },
        {
          name: 'Load Json',
          method: this.loadJson,
        },
        {
          name: 'Save Json',
          method: this.saveJson,
          keymap: ['ctrl', 's'],
        },
      ],
    },
    {
      name: 'Edit',
      items: [
        {
          name: 'Copy',
          method: this.onCopy,
          keymap: ['ctrl', 'c'],
        },
        {
          name: 'Paste',
          method: AppModule.pasteFace,
          keymap: ['ctrl', 'v'],
        },
        {
          name: 'Delete',
          method: AppModule.deleteFace,
          keymap: ['backspace'],
        },
        {
          name: 'Next Frame',
          method: AppModule.nextFrame,
          keymap: ['.'],
        },
        {
          name: 'Prev Frame',
          method: AppModule.prevFrame,
          keymap: [','],
        },
        {
          name: 'Preferences',
          method: this.showPreferences,
          keymap: ['ctrl', '.'],
        },
      ],
    },
    {
      name: 'Help',
      items: [
        {
          name: 'Show Help',
          method: this.showHelp,
          keymap: ['shift', '?'],
        },
      ],
    },
  ]

  private loadVideo() {
    this.$buefy.dialog.confirm({
      message: 'Are you saved?',
      onConfirm: () =>  {
        const input = this.$refs.input
        input.accept = 'video/*'
        input.click()
      },
    })
  }

  private loadJson() {
    this.$buefy.dialog.confirm({
      message: 'current landmarks will be overwritten.',
      onConfirm: () =>  {
        const input = this.$refs.input
        input.accept = 'application/json'
        input.click()
      },
    })
  }

  private saveJson() {
    // reduce json size before save
    TimelineModule.reduceDataSize()
    saveAs(TimelineModule.jsonBlob, 'landmarks.json')
  }

  private onCopy() {
    if (AppModule.faceSelected) {
      AppModule.copyFace()
      this.$buefy.toast.open('Copied')
    } else {
      this.$buefy.toast.open({
          message: 'Select face to copy',
          type: 'is-warning',
      })
    }
  }

  private showHelp() {
    this.$buefy.modal.open({
      parent: this,
      component: HelpModal,
      hasModalCard: true,
    })
  }

  private showPreferences() {
    this.$buefy.modal.open({
      parent: this,
      component: PreferencesModal,
      hasModalCard: true,
    })
  }

  private onLoadFile(e: Event) {
    const input = this.$refs.input
    if (!input.files || input.files.length === 0) {
      return
    }
    const file = input.files[0]
    if (file.type.startsWith('video')) {
      AppModule.loadVideo(file)
    } else if (file.type.startsWith('application/json')) {
      TimelineModule.loadJsonFile(file).catch((err) => {
        console.warn(err)
        this.showNotSupported()
      })
    } else {
      console.log('unknown file', file)
      this.showNotSupported()
    }
  }

  private showNotSupported() {
    this.$buefy.dialog.alert('This file is not supported.')
  }

}
</script>

<style lang="sass" scoped>
input
  display: none
</style>
