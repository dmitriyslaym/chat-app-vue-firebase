<template>
  <div class="sign-up">
    <form v-on:submit.prevent="signUp">
      <div class="form-group">
        <label for="user-name">Name</label>
        <input v-model="name" type="text" class="form-control" id="user-name" placeholder="Name">
      </div>
      <div class="form-group">
        <label for="user-email">Email address</label>
        <input v-model="email" type="email" class="form-control" id="user-email" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="user-password">Password</label>
        <input v-model="password" type="password" class="form-control" id="user-password" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      email: '',
      password: '',
      name: ''
    }
  },
  methods: {
    ...mapActions('user', ['signUpWithEmail']),
    signUp: function () {
      this.signUpWithEmail({ email: this.email, password: this.password, name: this.name })
    }
  }
}
</script>

<style scoped>

</style>
