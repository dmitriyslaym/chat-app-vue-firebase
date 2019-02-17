// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTimesCircle, faUndo, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App'
import store from './store'

library.add(faEdit)
library.add(faTimesCircle)
library.add(faUndo)
library.add(faSave)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store
})
