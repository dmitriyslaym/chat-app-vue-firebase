<template>
  <div class="user-header">
    <h2 class="user-header__text">Hello, {{ userName }}!</h2>
    <button type="button" v-on:click="initLogOut" class="btn btn-primary">Log Out</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserHeader',
  computed: {
    ...mapState({
      userName: state => state.auth.name
    })
  },
  methods: {
    ...mapActions('auth', ['signOut']),
    ...mapActions('dialogs', ['resetDialogs']),
    initLogOut: function () {
      this.signOut()
      this.resetDialogs()
    }
  }
}
</script>

<style scoped>
  .user-header {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .user-header__text {
    margin-right: 10px;
  }
</style>
