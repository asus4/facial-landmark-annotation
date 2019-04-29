import Vue from 'vue'
import { VuexModule, Module, Mutation, MutationAction, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { loadAsText } from '@/utils/file'
import { IFace, IFrameData, IVideoMetaData } from '../types'


export interface ITimelineState {
  meta: IVideoMetaData
  frames: IFace[][]
}


const roundTo2Decimal = (n: number) => {
  return Math.round(n * 100) / 100
}

const roundFaceDecimal = (face: IFace) => {
  // rect
  face.rect.x = roundTo2Decimal(face.rect.x)
  face.rect.y = roundTo2Decimal(face.rect.y)
  face.rect.width = roundTo2Decimal(face.rect.width)
  face.rect.height = roundTo2Decimal(face.rect.height)
  // points
  face.landmarks.forEach((p) => {
    p.x = roundTo2Decimal(p.x)
    p.y = roundTo2Decimal(p.y)
  })
}

@Module({ dynamic: true, store, name: 'timeline', namespaced: true })
class Timeline extends VuexModule implements ITimelineState {

  public meta: IVideoMetaData = {
    duration: 0,
    frames: 0,
    width: 0,
    height: 0,
  }

  public frames: IFace[][] = []

  public get firstBlankFrame(): number {
    for (let i = 0; i < this.frames.length; i++) {
      if (!this.frames[i]) {
        return i
      }
    }
    return -1
  }

  public get jsonBlob(): Blob {
    const json = JSON.stringify({
      meta: this.meta,
      frames: this.frames,
    })
    return new Blob([json], { type: 'application/json;charset=utf-8' })
  }

  @Mutation
  public reduceDataSize() {
    this.frames.forEach((frame) => {
      if (frame) {
        frame.forEach((face) => {
          roundFaceDecimal(face)
        })
      }
    })
  }

  @Mutation
  public setMetaData(meta: IVideoMetaData) {
    this.meta = meta
    this.frames = new Array(Math.ceil(meta.frames)) // clear frames
  }

  @Mutation
  public updateFrame(data: IFrameData) {
    data.faces.forEach((face) => {
      roundFaceDecimal(face)
    })
    Vue.set(this.frames, data.frame, data.faces)
  }

  @MutationAction({ mutate: ['meta', 'frames' ]})
  public async loadJsonFile(file: File): Promise<{ meta: IVideoMetaData; frames: IFace[][]; }> {
    const json = await loadAsText(file)
    return JSON.parse(json)
  }

}

export const TimelineModule = getModule(Timeline)
