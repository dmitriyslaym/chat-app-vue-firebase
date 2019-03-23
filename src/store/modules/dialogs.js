import Vue from 'vue'
import Vuex from 'vuex'
import { getDBRef } from '../../database'

Vue.use(Vuex)

const state = {
  selectedDialog: '',
  messages: {},
  typingUsers: {}
}

const dbPath = {
  messages: '',
  typingUsers: ''
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
  },
  updateTypingUser: function (state, { userId, isTyping }) {
    state.typingUsers = {
      ...state.typingUsers,
      [userId]: isTyping
    }
  },
  resetDialogsData: function (state) {
    state.selectedDialog = ''
    state.messages = {}
    state.typingUsers = {}
  }
}

function resetDialogs (context) {
  context.commit('resetDialogsData')

  if (dbPath.messages && dbPath.typingUsers) {
    getDBRef(dbPath.messages).off('child_added')
    getDBRef(dbPath.messages).off('child_changed')
    getDBRef(dbPath.messages).off('child_removed')
    getDBRef(dbPath.typingUsers).off('child_added')
    getDBRef(dbPath.typingUsers).off('child_changed')
    dbPath.messages = ''
    dbPath.typingUsers = ''
  }
}

const actions = {
  loadDialogMessages (context, { selectedDialog }) {
    resetDialogs(context)

    context.commit('updateSelectedDialog', { selectedDialog })
    dbPath.messages = `dialogs/${selectedDialog}/messages`
    dbPath.typingUsers = `dialogs/${selectedDialog}/typingUsers`
    getDBRef(dbPath.messages).on('child_added', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: { ...snapshot.val(), id: snapshot.key } } })
      setTimeout(() => {
        const messagesEl = document.getElementById('messages')
        messagesEl.scrollTop = messagesEl.scrollHeight
      }, 100)
    })
    getDBRef(dbPath.messages).on('child_changed', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: { ...snapshot.val(), id: snapshot.key } } })
    })
    getDBRef(dbPath.messages).on('child_removed', (snapshot) => {
      context.commit('updateMessage', { message: { key: snapshot.key, val: null } })
    })

    getDBRef(dbPath.typingUsers).on('child_added', (snapshot) => {
      context.commit('updateTypingUser', { userId: snapshot.key, isTyping: snapshot.val() })
    })
    getDBRef(dbPath.typingUsers).on('child_changed', (snapshot) => {
      context.commit('updateTypingUser', { userId: snapshot.key, isTyping: snapshot.val() })
    })
  },

  saveTypingUser (context, { userId, isTyping }) {
    getDBRef(`dialogs/${context.state.selectedDialog}/typingUsers`).update({ [userId]: isTyping })
  },

  resetDialogs (context) {
    resetDialogs(context)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
