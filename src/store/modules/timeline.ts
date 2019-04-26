import Vue from 'vue'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import * as faceapi from 'face-api.js'

export interface IVideoMetaData {
  duration: number,
  frames: number,
  width: number,
  height: number,
}

export interface IFace {
  id: number,
  rect: faceapi.IRect,
  landmarks: faceapi.IPoint[]
}

export interface ITimelineState {
  meta: IVideoMetaData
  frames: IFace[][]

  getFrameData(frame: number): IFace[]
}

export interface FrameData {
  frame: number
  faces: IFace[]
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

  public getFrameData(frame: number): IFace[] {
    console.log('getFrameData', this.frames)
    return this.frames[frame]
  }

  public get jsonBlob(): Blob {
    const json = JSON.stringify({
      meta: this.meta,
      frames: this.frames,
    })
    return new Blob([json], { type: 'application/javascript;charset=utf-8' })
  }

  @Mutation
  public setMetaData(meta: IVideoMetaData) {
    this.meta = meta
    this.frames = new Array(Math.ceil(meta.frames)) // clear frames
  }

  @Mutation
  public updateFrame(data: FrameData) {
    Vue.set(this.frames, data.frame, data.faces)
  }

}

export const TimelineModule = getModule(Timeline)
