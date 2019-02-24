<template>
  <div id="app">
    <div v-if="!isAuthLoaded" class="page-loader-wrapper">
      <div class="spinner-grow" style="width: 5rem; height: 5rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else class="app-container">
      <div class="app-header">
        <Users v-if="userId" />
        <div class="main-icon"></div>
      </div>
      <AuthForm v-if="!userId" />
      <div v-else>
        <UserHeader />
        <div v-if="selectedDialog">
          <Messages/>
          <NewMessage/>
        </div>
        <h3 v-else>Please select a user to start a dialog with</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Messages from './components/Messages'
import NewMessage from './components/NewMessage'
import AuthForm from './components/AuthForm'
import UserHeader from './components/UserHeader'
import Users from './components/Users'

export default {
  name: 'App',
  components: {
    UserHeader,
    Messages,
    NewMessage,
    AuthForm,
    Users
  },
  data: () => ({
    isAuthLoaded: false
  }),
  computed: {
    ...mapState({
      userId: state => state.auth.id,
      isAuthorizing: state => state.auth.isAuthorizing,
      selectedDialog: state => state.dialogs.selectedDialog
    })
  },
  methods: {
    ...mapMutations('auth', ['setUserData', 'resetUserData'])
  },
  created () {
    window.firebase.auth().onAuthStateChanged((user) => {
      if (!this.isAuthLoaded) {
        this.isAuthLoaded = true
      }

      if (user) {
        if (!this.userId && !this.isAuthorizing) {
          const { providerData, uid } = user
          const { displayName, photoURL, email } = providerData[0]
          this.setUserData({
            name: displayName,
            image: photoURL,
            email,
            id: uid,
            updateProfile: user.updateProfile.bind(user)
          })
        }
      } else {
        this.userId && this.resetUserData()
      }
    })
  }
}
</script>

<style>
  html {
    height: 100%;
  }

  body {
    height: 100%;
  }

  .page-loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .main-icon {
    background-image: URL('https://homkin.ru/wp-content/uploads/2018/06/pig27.jpg');
    background-repeat: no-repeat;
    background-size: 290px;
    background-position: center;
    width: 180px;
    height: 180px;
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
    margin: 0 auto;
    height: 100%;
  }

  .app-container {
    margin-top: 20px;
  }
</style>
