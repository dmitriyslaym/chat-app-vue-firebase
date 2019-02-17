import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  text: '',
  id: undefined
}

const mutations = {
  updateFormData (state, { text, id }) {
    state.text = text
    state.id = id
  },

  resetFormData (state) {
    state.text = ''
    state.id = ''
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
