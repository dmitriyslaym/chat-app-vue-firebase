<template>
  <div id="app">
    <div class="main-icon"></div>
    <AuthForm v-if="!userId"/>
    <div v-else>
      <UserHeader />
      <Messages/>
      <NewMessage/>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Messages from './components/Messages'
import NewMessage from './components/NewMessage'
import AuthForm from './components/AuthForm'
import UserHeader from './components/UserHeader'

export default {
  name: 'App',
  components: {
    UserHeader,
    Messages,
    NewMessage,
    AuthForm
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    })
  },
  methods: {
    ...mapMutations('user', ['setUserData', 'resetUserData'])
  },
  created () {
    window.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { providerData, uid } = user
        const { displayName, photoURL, email } = providerData[0]
        this.setUserData({
          name: displayName,
          image: photoURL,
          email,
          id: uid,
          updateProfile: user.updateProfile.bind(user)
        })
      } else {
        this.resetUserData()
      }
    })
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
