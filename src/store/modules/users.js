import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  usersMap: {}
}

const mutations = {
  saveNewUserInStore: function (state, { user }) {
    state.usersMap = { ...state.usersMap, [user.id]: user }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
