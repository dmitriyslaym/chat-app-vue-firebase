import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import messageForm from './modules/messageForm'
import dialogs from './modules/dialogs'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    messageForm,
    dialogs,
    users
  }
})
