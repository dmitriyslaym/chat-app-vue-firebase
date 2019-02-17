import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  name: 'Slaym'
}

const mutations = {
  setName (state, messageToUpdate) {
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
