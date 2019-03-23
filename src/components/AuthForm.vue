<template>
  <div>
    <form class="auth-form" v-on:submit.prevent="handleFormSubmit">
      <div v-if="mode === authMode.signUp" class="form-group">
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
      <button type="submit" class="btn btn-primary" v-bind:disabled="isAuthorizing">
        <span v-if="!isAuthorizing">
          {{ mode }}
        </span>
        <span v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Authorizing...
        </span>
      </button>
    </form>
    <div class="dropdown-divider"></div>
    <div v-if="mode === authMode.signIn">
      <a v-on:click.prevent="setMode(authMode.signUp)" class="dropdown-item" href="#">New around here? Sign up</a>
    </div>
    <div v-else>
      <a v-on:click.prevent="setMode(authMode.signIn)" class="dropdown-item" href="#">Already have account? Sign in</a>
    </div>
    <div v-if="error" class="auth-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { authMode } from '../const'

export default {
  name: 'AuthForm',
  data () {
    return {
      authMode,
      email: '',
      password: '',
      name: '',
      mode: authMode.signIn
    }
  },
  computed: {
    ...mapState({
      isAuthorizing: state => state.auth.isAuthorizing,
      error: state => state.auth.error
    })
  },
  watch: {
    name: function () {
      this.resetError()
    },
    email: function () {
      this.resetError()
    },
    password: function () {
      this.resetError()
    }
  },
  methods: {
    ...mapActions('auth', ['signUpWithEmail', 'signInWithEmail']),
    ...mapMutations('auth', ['setIsAuthorizing', 'resetError']),
    setMode: function (mode) {
      this.resetError()
      this.mode = mode
    },
    signIn: function () {
      this.signInWithEmail({ email: this.email, password: this.password })
    },
    signUp: function () {
      this.signUpWithEmail({ email: this.email, password: this.password, name: this.name })
    },
    handleFormSubmit: function () {
      this.setIsAuthorizing(true)
      this.mode === authMode.signIn ? this.signIn() : this.signUp()
    }
  }
}
</script>

<style scoped>
  .auth-error {
    margin-top: 10px;
    border: 1px solid red;
    padding: 10px;
    color: red;
    font-weight: 700;
  }
</style>
