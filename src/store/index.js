import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import messageForm from './modules/messageForm'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    messageForm
  }
})
