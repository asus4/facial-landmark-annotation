import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { TimelineModule, IFace } from './timeline'

export interface IAppState {
  currentFrame: number
  duration: number
  fps: number
  videoUrl: string
}

@Module({ dynamic: true, store, name: 'app', namespaced: true })
class App extends VuexModule implements IAppState {

  public currentFrame: number = 0
  public duration: number = 0
  public fps: number = 30
  public videoUrl: string = ''
  public isAutoProcess: boolean = false
  public faceSelected: IFace | null = null
  public faceCopied: IFace | null = null

  public get totalFrame(): number {
    return this.fps * this.duration
  }

  public get currentTime(): number {
    return this.currentFrame / this.fps
  }

  public get canCopy(): boolean {
    return this.faceSelected !== null
  }

  public get canPaste(): boolean {
    return this.faceCopied !== null
  }

  @Mutation
  public nextFrame() {
    if (this.totalFrame <= this.currentFrame) {
      return
    }
    this.currentFrame++
    this.faceSelected = null
  }

  @Mutation
  public prevFrame() {
    if (this.currentFrame === 0) {
      return
    }
    this.currentFrame--
    this.faceSelected = null
  }

  @Mutation
  public setCurrentFrame(value: number) {
    if (value < 0 || this.totalFrame < value) {
      return
    }
    this.currentFrame = value
    this.faceSelected = null
  }

  @Mutation
  public nextBlankFrame() {
    const frame = TimelineModule.firstBlankFrame
    if (frame < 0) {
      this.isAutoProcess = false
      return
    }
    if (this.totalFrame < frame) {
      return
    }
    this.currentFrame = frame
  }

  @Mutation
  public loadVideo(file: File) {
    this.videoUrl = URL.createObjectURL(file)
  }

  @Mutation
  public setVideoDuration(duration: number) {
    this.duration = duration
  }

  @Mutation
  public startAutoProcess() {
    this.isAutoProcess = true
  }

  @Mutation
  public stopAutoProcess() {
    this.isAutoProcess = false
  }

  @Mutation
  public selectFace(face: IFace | null) {
    this.faceSelected = face
  }

  @Mutation
  public copyFace() {
    this.faceCopied = this.faceSelected
  }

  @Mutation
  public pasteFace() {
    console.log('TODO paseteface', this.faceCopied)

  }
}

export const AppModule = getModule(App)
