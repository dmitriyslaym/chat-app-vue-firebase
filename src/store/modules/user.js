import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  id: '',
  name: '',
  image: '',
  email: '',
  updateProfile: undefined
}

const mutations = {
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
  }
}

const commitUserData = ({ context, user }) => {
  const { providerData } = user
  context.commit('setUserData', {
    name,
    image: providerData[0].photoURL,
    email: providerData[0].email,
    id: user.uid,
    updateProfile: user.updateProfile.bind(user)
  })
}

const actions = {
  signUpWithEmail (context, { email, password, name }) {
    window.firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        commitUserData({ context, user })
        user.updateProfile({ displayName: name })
      })
      .then((data) => {
        console.log('name has been updated', data)
      })
      .catch((error) => {
        console.log('sign up error', error)
      })
  },
  signInWithEmail (context, { email, password }) {
    window.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        commitUserData({ context, user })
      })
      .catch((error) => {
        console.log('sign in error', error)
      })
  },
  signOut (context) {
    window.firebase.auth().signOut()
      .then(() => {
        context.commit('resetUserData')
      })
      .catch(error => {
        console.log('error', error)
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
