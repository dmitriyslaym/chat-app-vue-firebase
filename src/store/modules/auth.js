import Vue from 'vue'
import Vuex from 'vuex'
import { getDBRef } from '../../database'

Vue.use(Vuex)

const state = {
  id: '',
  name: '',
  image: '',
  email: '',
  updateProfile: undefined,
  isAuthorizing: false,
  error: ''
}

const mutations = {
  setIsAuthorizing (state, isAuthorizing) {
    state.isAuthorizing = isAuthorizing
  },
  setUserData (state, { id, name, image, email, updateProfile }) {
    state.id = id
    state.name = name
    state.image = image
    state.email = email
    state.updateProfile = updateProfile
  },
  resetUserData () {
    state.id = ''
    state.name = ''
    state.image = ''
    state.email = ''
    state.updateProfile = undefined
  },
  setError (state, { error }) {
    state.error = error
  }
}

const commitUserData = ({ context, user, name }) => {
  const { providerData } = user
  context.commit('setUserData', {
    name: name || providerData[0].displayName,
    image: providerData[0].photoURL,
    email: providerData[0].email,
    id: user.uid,
    updateProfile: user.updateProfile.bind(user)
  })
}

const actions = {
  signUpWithEmail (context, { email, password, name }) {
    window.firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => user.updateProfile({ displayName: name }).then(() => user))
      .then((user) => {
        return getDBRef(`users/${user.uid}`).set({
          name,
          id: user.uid
        }).then(responseFromAddNewUser => ({ responseFromAddNewUser, user }))
      })
      .then(({ user }) => {
        commitUserData({ context, user, name })
      })
      .catch((error) => {
        context.commit('setError', { error: error.message })
      })
      .finally(() => {
        context.commit('setIsAuthorizing', false)
      })
  },
  signInWithEmail (context, { email, password }) {
    window.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        commitUserData({ context, user })
      })
      .catch((error) => {
        context.commit('setError', { error: error.message })
      })
      .finally(() => {
        context.commit('setIsAuthorizing', false)
      })
  },
  signOut (context) {
    window.firebase.auth().signOut()
      .then(() => {
        context.commit('resetUserData')
      })
      .catch(error => {
        context.commit('setError', { error: error.message })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
