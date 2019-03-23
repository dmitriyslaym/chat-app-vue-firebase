import Vue from 'vue'
import Vuex from 'vuex'
import { getDBRef } from '../../database'

Vue.use(Vuex)

const state = {
  selectedDialog: '',
  messages: {},
  typingUsers: {},
  areLoaded: false
}

const dbPath = {
  messages: '',
  typingUsers: ''
}

let timestampForRequestedMessages

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
  },
  updateLoadedStatus: function (state, { areLoaded }) {
    state.areLoaded = areLoaded
  }
}

function resetDialogs (context) {
  context.commit('resetDialogsData')
  context.commit('updateLoadedStatus', { areLoaded: false })

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

    timestampForRequestedMessages = Date.now()
    context.commit('updateSelectedDialog', { selectedDialog })
    dbPath.messages = `dialogs/${selectedDialog}/messages`
    dbPath.typingUsers = `dialogs/${selectedDialog}/typingUsers`

    getDBRef(dbPath.messages).once('value', function (snapshot) {
      if (!snapshot.hasChildren()) {
        context.commit('updateLoadedStatus', { areLoaded: true })
      } else {
        snapshot.forEach(function (childSnapshot) {
          context.commit('updateMessage', { message: { key: childSnapshot.key, val: { ...childSnapshot.val(), id: childSnapshot.key } } })
        })
        setTimeout(() => {
          console.log('scroll to bottom')
          const messagesEl = document.getElementById('messages')
          messagesEl.scrollTop = messagesEl.scrollHeight
          context.commit('updateLoadedStatus', { areLoaded: true })
        }, 1000)
      }
    })

    getDBRef(dbPath.messages).on('child_added', (snapshot) => {
      const message = snapshot.val()
      if (timestampForRequestedMessages < message.timestamp) {
        context.rootState.auth.id !== message.userId && document.getElementById('notification-audio').play()
        context.commit('updateMessage', { message: { key: snapshot.key, val: { ...message, id: snapshot.key } } })
        setTimeout(() => {
          const messagesEl = document.getElementById('messages')
          messagesEl.scrollTop = messagesEl.scrollHeight
        }, 100)
      }
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
