import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import settings from './settings'
import diary from './diary'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user, shared, settings, diary
  }
})
