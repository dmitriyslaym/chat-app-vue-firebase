import Vue from 'vue'
import Vuex from 'vuex'
import { getDBRef } from '../../database'

Vue.use(Vuex)

const state = {
  selectedDialog: '',
  messages: {}
}

const mutations = {
  updateSelectedDialog: function (state, { selectedDialog }) {
    state.selectedDialog = selectedDialog
  },
  updateMessage: function (state, { message }) {
    state.messages = {
      ...state.messages,
      [message.key]: message.val
    }
  }
}

const actions = {
  loadDialogMessages (context, { selectedDialog }) {
    context.commit('updateSelectedDialog', { selectedDialog })
    // TODO Need to reset previous subscription
    const path = `dialogs/${selectedDialog}/messages`
    getDBRef(path).on('child_added', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: { ...snapshot.val(), id: snapshot.key } } })
      setTimeout(() => {
        const messagesEl = document.getElementById('messages')
        messagesEl.scrollTop = messagesEl.scrollHeight
      }, 100)
    })
    getDBRef(path).on('child_changed', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: { ...snapshot.val(), id: snapshot.key } } })
    })
    getDBRef(path).on('child_removed', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: null } })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
