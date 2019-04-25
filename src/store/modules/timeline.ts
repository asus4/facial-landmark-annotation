import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import * as faceapi from 'face-api.js'

export interface VideoMetaData {
  duration: number,
  width: number,
  height: number,
}

export interface Face {
  id: number,
  rect: faceapi.IRect,
  landmarks: faceapi.IPoint[]
}

export interface ITimelineState {
  meta: VideoMetaData
  frames: Face[][]
}

@Module({ dynamic: true, store, name: 'timeline' })
class Timeline extends VuexModule implements ITimelineState {

  public meta: VideoMetaData = {
    duration: 0,
    width: 0,
    height: 0,
  }

  public frames: Face[][] = []

  @Mutation
  public setMetaData(meta: VideoMetaData) {
    this.meta = meta
    this.frames = [] // clear frames
  }
}

export const TimelineModule = getModule(Timeline)
