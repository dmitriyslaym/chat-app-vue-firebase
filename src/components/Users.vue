<template>
  <div class="users">
    <ul>
      <li v-bind:key="user.id" v-for="user in usersList">
        <div class="btn-group dropright">
          <button
            v-on:click="toggleUserDropdown({ id: user.id })"
            type="button"
            class="btn btn-secondary"
          >
            {{ user.name }}
          </button>
          <div class="dropdown-menu" v-bind:class="{ visible: user.isDropdownVisible }">
            <span>Open dialog with</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import { mapMutations, mapState } from 'vuex'
import { getDBRef } from '../database'

export default {
  name: 'Users',
  data () {
    return {
      users: {}
    }
  },
  computed: {
    usersList: function () {
      return Object.values(this.users)
    }
  },
  methods: {
    toggleUserDropdown: function ({ id }) {
      this.users = {
        ...this.users,
        [id]: {
          ...this.users[id],
          isDropdownVisible: !this.users[id].isDropdownVisible
        }
      }
    }
  },
  created () {
    getDBRef('users').on('child_added', (snapshot) => {
      this.users = {
        ...this.users,
        [snapshot.key]: { ...snapshot.val(), isDropdownVisible: false }
      }
    })
  }
}
</script>

<style scoped>
  .dropdown-menu.visible {
    display: block;
  }
</style>
