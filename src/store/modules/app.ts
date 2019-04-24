import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IAppState {
  currentFrame: number
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public currentFrame: number = 0

  @Mutation
  public nextFrame() {
      this.currentFrame++
  }

  @Mutation
  public prevFrame() {
    this.currentFrame--
  }
}

export const AppModule = getModule(App)
