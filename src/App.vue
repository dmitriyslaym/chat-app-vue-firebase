<template>
  <div id="app">
    <div class="main-icon"></div>
    <Messages/>
    <NewMessage/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import swal from 'sweetalert2'
import Messages from './components/Messages'
import NewMessage from './components/NewMessage'
import { localStorageNameKey } from './const'

export default {
  name: 'App',
  components: {
    Messages,
    NewMessage
  },
  methods: {
    ...mapActions('auth', ['auth', 'setName'])
  },
  created () {
    if (!localStorage.getItem(localStorageNameKey)) {
      swal.fire({
        title: 'Please provide your name',
        input: 'text',
        inputValue: '',
        inputValidator: (value) => {
          return !value && 'Please use some name'
        }
      }).then(response => {
        this.setName(response.value)
      })
    }
  }
}
</script>

<style>
.main-icon {
  background-image: URL('https://homkin.ru/wp-content/uploads/2018/06/pig27.jpg');
  background-repeat: no-repeat;
  background-size: 402px;
  background-position: center;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 75%;
  min-width: 450px;
  margin: 60px auto 0 auto;
}
</style>
