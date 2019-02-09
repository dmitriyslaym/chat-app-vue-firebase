<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Messages/>
    <NewMessage/>
  </div>
</template>

<script>
import Messages from './components/Messages'
import NewMessage from './components/NewMessage'

export default {
  name: 'App',
  components: {
    Messages,
    NewMessage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 50%;
  min-width: 450px;
  margin: 60px auto 0 auto;
}
</style>
