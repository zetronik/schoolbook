import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import settings from './settings'
import diary from './diary'
import admin from "./admin";
import global from "./global";
import accessStudent from "./accessStudent";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user, shared, settings, diary, admin, global, accessStudent
  }
})
