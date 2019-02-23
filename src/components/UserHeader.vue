<template>
  <div class="user-header">
    <h2>Hello {{ userName }}</h2>
    <button type="button" v-on:click="initSignOut" class="btn btn-primary">Sign Out</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserHeader',
  computed: {
    ...mapState({
      userName: state => state.user.name
    })
  },
  methods: {
    ...mapActions('user', ['signOut']),
    initSignOut: function () {
      this.signOut()
    }
  }
}
</script>

<style scoped>

</style>
