import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IAppState {
  currentFrame: number
  duration: number
  fps: number
  videoUrl: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {

  public currentFrame: number = 0
  public duration: number = 0
  public fps: number = 30
  public videoUrl: string = ''

  public get totalFrame(): number {
    return this.fps * this.duration
  }

  public get currentTime(): number {
    return this.currentFrame / this.fps
  }

  @Mutation
  public nextFrame() {
      this.currentFrame++
  }

  @Mutation
  public prevFrame() {
    if (this.currentFrame === 0) {
      return
    }
    this.currentFrame--
  }

  @Mutation
  public setCurrentFrame(value: number) {
    if (value < 0 || this.totalFrame < value) {
      return
    }
    this.currentFrame = value
  }

  @Mutation
  public loadVideo(file: File) {
    this.videoUrl = URL.createObjectURL(file)
  }

  @Mutation
  public setVideoDuration(duration: number) {
    this.duration = duration
  }
}

export const AppModule = getModule(App)
