import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { ITimelineState } from './modules/timeline'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState,
  timeline: ITimelineState,
}
export default new Vuex.Store<IRootState>({})
