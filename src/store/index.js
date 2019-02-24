import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import messageForm from './modules/messageForm'
import dialogs from './modules/dialogs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    messageForm,
    dialogs
  }
})
