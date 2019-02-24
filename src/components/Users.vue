<template>
  <div class="users">
    <div class="btn-group">
      <button
        v-on:click="toggleUsersList"
        class="btn btn-secondary btn-lg dropdown-toggle"
        type="button"
      >
        Users list
      </button>
      <div v-if="isUsersListVisible" class="dropdown-menu visible">
        <ul class="users-list">
          <li
            v-on:click="openDialogWithUser({ id: user.id })"
            class="user-item"
            v-bind:key="user.id"
            v-for="user in usersList"
          >
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getDBRef } from '../database'
import { getDialogId } from '../utils'

export default {
  name: 'Users',
  data () {
    return {
      users: {},
      isUsersListVisible: false
    }
  },
  computed: {
    ...mapState({
      currentUserId: state => state.auth.id
    }),
    usersList: function () {
      return Object.values(this.users).filter(user => user.id !== this.currentUserId)
    }
  },
  methods: {
    ...mapActions('dialogs', ['loadDialogMessages']),
    toggleUsersList: function () {
      this.isUsersListVisible = !this.isUsersListVisible
    },
    openDialogWithUser: function ({ id }) {
      this.toggleUsersList()
      this.loadDialogMessages({ selectedDialog: getDialogId({ currentUserId: this.currentUserId, otherUserId: id }) })
    }
  },
  created () {
    getDBRef('users').on('child_added', (snapshot) => {
      this.users = {
        ...this.users,
        [snapshot.key]: snapshot.val()
      }
    })
  }
}
</script>

<style scoped>
  .dropdown-menu.visible {
    display: block;
    padding: 0;
  }

  .users {
    text-align: left;
  }

  .users-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .user-item {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: all .7s;
    font-weight: bold;
  }

  .user-item:hover {
    background-color: grey;
    color: white;
  }
</style>
