import Vue from 'vue'
import Vuex from 'vuex'
import { localStorageNameKey } from '../../const'

Vue.use(Vuex)

const state = {
  name: localStorage.getItem(localStorageNameKey)
}

const mutations = {
  setName (state, name) {
    state.name = name
  }
}

const actions = {
  setName (context, name) {
    localStorage.setItem(localStorageNameKey, name)
    context.commit('setName', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
